// ============================================================
//  API Backend สำหรับ React Face Recognition & OT Summary
//  ซิงก์กับ: https://resplendent-strudel-e003d0.netlify.app/
// ============================================================

// ⭐️ ใส่รหัส Google Sheet ของคุณที่นี่ (ใช้สำหรับทุกชีตเพื่อป้องกันข้อผิดพลาดตอน Deploy)
const SHEET_ID = '1R3-R-HsrfGBt1L2wMFrsIBZnCz20YNRhVTWnb4Ygxto';

// Helper Function สำหรับส่ง JSON กลับไปยัง React
function jsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

// ==========================================
// ฟังก์ชันอัจฉริยะ แปลงวันที่ทุกฟอร์แมตให้เป็น YYYY-MM-DD เพื่อเทียบให้ตรงกัน 100%
// ==========================================
function parseUnifiedDate(h) {
  const trimmed = String(h).trim();
  if (!trimmed || trimmed === '-') return null;

  const match = trimmed.match(/(\d{1,4})[-/.](\d{1,2})[-/.](\d{1,4})/);
  if (match) {
    let num1 = parseInt(match[1], 10);
    let num2 = parseInt(match[2], 10);
    let num3 = parseInt(match[3], 10);
    let y, m, d;

    if (num1 > 1000) {
      y = num1; m = num2; d = num3;
    } else if (num3 > 1000) {
      y = num3; d = num1; m = num2; 
      if (m > 12 && d <= 12) { m = num1; d = num2; } // สลับถ้าเดือน/วัน เพี้ยน
    } else {
      y = num3 + 2000; d = num1; m = num2;
      if (m > 12 && d <= 12) { m = num1; d = num2; }
    }

    if (y > 2500) y -= 543;
    return `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
  }
  return null;
}

// ==========================================
// 1. จัดการคำขอแบบ GET (ดึงข้อมูล)
// ==========================================
function doGet(e) {
  const action = e.parameter.action;
  
  try {
    if (action === 'getConfig') {
      return jsonResponse(getConfig());
    } else if (action === 'getKnownFaces') {
      return jsonResponse(getKnownFaces());
    } else {
      return jsonResponse({ error: 'Unknown GET action: ' + action });
    }
  } catch (err) {
    return jsonResponse({ error: err.toString() });
  }
}

// ==========================================
// 2. จัดการคำขอแบบ POST (ส่งข้อมูลมาบันทึก)
// ==========================================
function doPost(e) {
  let parsedData;
  
  try {
    parsedData = JSON.parse(e.postData.contents);
  } catch (err) {
    return jsonResponse({ status: "error", message: 'รูปแบบ JSON ไม่ถูกต้อง' });
  }

  try {
    if (Array.isArray(parsedData)) {
      if (parsedData.length === 0) {
        return jsonResponse({ status: "error", message: "ไม่พบข้อมูล" });
      }
      if (parsedData[0].action === 'UPDATE_ATTENDANCE') {
        return jsonResponse(updateAttendanceBatch(parsedData));
      }
      return jsonResponse(handleOTUpdate(parsedData));
    }
    
    const action = parsedData.action;
    if (action === 'registerUser') {
      return jsonResponse(registerUser(parsedData.name, parsedData.faceDescriptor));
    } else if (action === 'logAttendance') {
      return jsonResponse(logAttendance(parsedData.name, parsedData.date, parsedData.time, parsedData.status));
    } else if (action === 'saveConfig') {
      return jsonResponse(saveConfig(parsedData.lat, parsedData.lng, parsedData.radius));
    } else {
      return jsonResponse({ status: "error", message: 'Unknown POST action: ' + action });
    }
    
  } catch (error) {
    return jsonResponse({ status: "error", message: error.toString() });
  }
}

// ==========================================
// ฟังก์ชันอัปเดตสถานะการเข้างานแบบกลุ่ม (จาก Dashboard)
// ==========================================
function updateAttendanceBatch(dataArray) {
  try {
    const ss = SpreadsheetApp.openById(SHEET_ID);
    let sheet = ss.getSheetByName('Attendance');
    
    if (!sheet) {
      return { status: "error", message: "ไม่พบชีต Attendance" };
    }

    const headers = sheet.getRange(1, 1, 1, Math.max(sheet.getLastColumn(), 1)).getDisplayValues()[0].map(h => String(h).trim());

    let idColIndex = headers.findIndex(h => h.toLowerCase().includes('รหัส') || h.toLowerCase().includes('id') || h.toLowerCase().includes('工号') || h.toLowerCase().includes('emp'));
    if (idColIndex === -1) idColIndex = 0; 

    const idValues = sheet.getRange(1, idColIndex + 1, sheet.getLastRow(), 1).getDisplayValues();
    const rowMap = {};
    for (let i = 1; i < idValues.length; i++) {
      const empId = String(idValues[i][0]).trim();
      if (empId) rowMap[empId] = i + 1;
    }

    let updatedCount = 0;

    dataArray.forEach(item => {
      const targetDate = item.date; // รูปแบบ DD/MM/YYYY
      const targetYMD = parseUnifiedDate(targetDate);
      const empId = String(item.id).trim();
      const newStatus = item.status; 

      // ✨ Smart Date Match
      let colIndex = -1;
      for (let j = 0; j < headers.length; j++) {
        const headerYMD = parseUnifiedDate(headers[j]);
        if ((targetYMD && headerYMD && targetYMD === headerYMD) || headers[j] === targetDate) {
          colIndex = j;
          break;
        }
      }
      
      if (colIndex === -1) {
        prepareDailyColumn(ss, sheet, targetDate);
        headers.push(targetDate);
        colIndex = headers.length - 1;
      }

      const rowIndex = rowMap[empId];
      if (rowIndex) {
        sheet.getRange(rowIndex, colIndex + 1).setValue(newStatus);
        sheet.getRange(rowIndex, colIndex + 1).setHorizontalAlignment('center');
        updatedCount++;
      }
    });

    return { status: "success", message: `อัปเดตสถานะสำเร็จ ${updatedCount} รายการ` };
  } catch (error) {
    return { status: "error", message: error.toString() };
  }
}

// ==========================================
// ฟังก์ชันของระบบบันทึก OT / แผนก (Grand_Summary)
// ==========================================
function handleOTUpdate(payload) {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  const sheet = ss.getSheetByName("Grand_Summary"); 

  if (!sheet) {
    return { status: "error", message: "ไม่พบชีต Grand_Summary" };
  }

  const displayValues = sheet.getDataRange().getDisplayValues();
  const rawValues = sheet.getDataRange().getValues();
  const headers = displayValues[0].map(h => String(h).trim()); 

  const targetDateStr = String(payload[0].date).trim();
  const targetYMD = parseUnifiedDate(targetDateStr);
  let dateColIndex = -1;

  // ✨ Smart Date Match
  for (let c = 0; c < headers.length; c++) {
    const headerYMD = parseUnifiedDate(headers[c]);
    if ((targetYMD && headerYMD && targetYMD === headerYMD) || headers[c] === targetDateStr) {
      dateColIndex = c;
      break;
    }
  }

  if (dateColIndex === -1) {
    dateColIndex = headers.length;
    const headerCell = sheet.getRange(1, dateColIndex + 1);
    headerCell.setNumberFormat("@"); 
    headerCell.setValue(targetDateStr);
    headers.push(targetDateStr);
  }

  let idColIndex = -1;
  for (let i = 0; i < headers.length; i++) {
    const h = String(headers[i]).replace(/\s+/g, '');
    if (h.includes("รหัส") || h.includes("ID") || h.includes("工号")) {
      idColIndex = i;
      break;
    }
  }

  if (idColIndex === -1) return { status: "error", message: "ไม่พบคอลัมน์รหัสพนักงาน" };

  const idRowMap = {}; 
  for (let r = 1; r < rawValues.length; r++) {
    const empId = String(rawValues[r][idColIndex]).trim();
    if (empId !== "") idRowMap[empId] = r; 
  }

  for (let i = 0; i < payload.length; i++) {
    const item = payload[i];
    const empId = String(item.id).trim();
    const hours = parseFloat(item.hours) || 0;
    const rowIndex = idRowMap[empId];

    if (rowIndex !== undefined) {
      sheet.getRange(rowIndex + 1, dateColIndex + 1).setValue(hours);
    } else {
      const rowLength = Math.max(headers.length, dateColIndex + 1);
      const newRow = new Array(rowLength).fill("");
      newRow[idColIndex] = empId;
      
      for(let col = 0; col < headers.length; col++) {
         const colName = String(headers[col] || "").trim();
         if(colName.includes("ชื่อ") || colName.includes("Name")) newRow[col] = item.name;
         if(colName.includes("ไลน์") || colName.includes("Line")) newRow[col] = item.line;
         if(colName.includes("กลุ่ม") || colName.includes("Group")) newRow[col] = item.groupName;
      }
      newRow[dateColIndex] = hours;
      
      sheet.appendRow(newRow);
      idRowMap[empId] = sheet.getLastRow() - 1; 
    }
  }

  return { status: "success" };
}

// ==========================================
// ฟังก์ชันของระบบ Face Recognition
// ==========================================
function registerUser(name, faceDescriptor) {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  let sheet = ss.getSheetByName('Users');
  if (!sheet) {
    sheet = ss.insertSheet('Users');
    sheet.appendRow(['Name', 'FaceDescriptor', 'RegisteredAt']);
    sheet.getRange('A1:C1').setFontWeight('bold');
  }

  sheet.appendRow([name, JSON.stringify(faceDescriptor), new Date()]);
  return { success: true, message: 'บันทึกข้อมูลใบหน้าเรียบร้อย' };
}

function getKnownFaces() {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  const sheet = ss.getSheetByName('Users');
  if (!sheet) return [];

  const data = sheet.getDataRange().getValues();
  if (data.length <= 1) return [];

  let users = [];
  for (let i = 1; i < data.length; i++) {
    const name = data[i][0];
    const jsonStr = data[i][1];
    if (name && jsonStr) {
      try {
        users.push({ label: name, descriptor: JSON.parse(jsonStr) });
      } catch (e) {}
    }
  }
  return users;
}

function logAttendance(name, frontendDate, frontendTime, frontendStatus) {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  const now = new Date();
  const timezone = ss.getSpreadsheetTimeZone();
  
  const timeStr = frontendTime ? frontendTime : Utilities.formatDate(now, timezone, 'HH:mm:ss');
  const dateStr = frontendDate ? frontendDate : Utilities.formatDate(now, timezone, 'dd/MM/yyyy');
  let status = frontendStatus;

  if (!status) {
    if (timeStr >= "05:00:00" && timeStr <= "08:00:00") {
      status = 'Present_Day';
    } else if (timeStr > "08:00:00" && timeStr <= "16:59:59") {
      status = 'Late_Day';
    } else if (timeStr >= "17:00:00" && timeStr <= "20:00:00") {
      status = 'Present_Night';
    } else {
      status = 'Late_Night';
    }
  }

  let logSheet = ss.getSheetByName('Attendance');
  if (!logSheet) {
    logSheet = ss.insertSheet('Attendance');
    logSheet.getRange(1, 1).setValue('Name').setFontWeight('bold');
  }

  const lastCol = Math.max(logSheet.getLastColumn(), 1);
  let headersDisplay = logSheet.getRange(1, 1, 1, lastCol).getDisplayValues()[0];

  let nameColIdx = -1;
  for (let j = 0; j < headersDisplay.length; j++) {
    let headerText = String(headersDisplay[j]).trim().toLowerCase();
    if (headerText === 'name' || headerText === 'ชื่อ') {
      nameColIdx = j;
      break;
    }
  }
  if (nameColIdx === -1) nameColIdx = 0;

  // ✨ Smart Date Match
  let dateColIdx = -1;
  const targetYMD = parseUnifiedDate(dateStr);
  
  for (let j = 0; j < headersDisplay.length; j++) {
    const headerYMD = parseUnifiedDate(headersDisplay[j]);
    if ((targetYMD && headerYMD && targetYMD === headerYMD) || String(headersDisplay[j]).trim() === dateStr) {
      dateColIdx = j;
      break;
    }
  }
  
  if (dateColIdx === -1) {
    prepareDailyColumn(ss, logSheet, dateStr);
    headersDisplay = logSheet.getRange(1, 1, 1, logSheet.getLastColumn()).getDisplayValues()[0];
    for (let j = 0; j < headersDisplay.length; j++) {
      const headerYMD = parseUnifiedDate(headersDisplay[j]);
      if ((targetYMD && headerYMD && targetYMD === headerYMD) || String(headersDisplay[j]).trim() === dateStr) {
        dateColIdx = j;
        break;
      }
    }
  }

  let userRowIdx = -1;
  let searchName = String(name).trim().toLowerCase();
  const fullData = logSheet.getDataRange().getValues();
  for (let i = 1; i < fullData.length; i++) {
    let rowName = String(fullData[i][nameColIdx]).trim().toLowerCase();
    if (rowName === searchName) {
      userRowIdx = i;
      break;
    }
  }

  if (userRowIdx === -1) {
    userRowIdx = fullData.length;
    logSheet.getRange(userRowIdx + 1, nameColIdx + 1).setValue(name);
  }

  logSheet.getRange(userRowIdx + 1, dateColIdx + 1).setValue(status);
  logSheet.getRange(userRowIdx + 1, dateColIdx + 1).setHorizontalAlignment('center');

  return { 
    success: true, 
    message: `บันทึกเวลาสำเร็จ: ${name} (${status} - ${timeStr})`, 
    status: status 
  };
}

function prepareDailyColumn(ss, sheet, dateStr) {
  const lastCol = Math.max(sheet.getLastColumn(), 1);
  const lastRow = Math.max(sheet.getLastRow(), 1);
  const newColIndex = lastCol + 1;
  
  const targetCell = sheet.getRange(1, newColIndex);
  targetCell.setNumberFormat("@"); // บังคับให้เป็น Text จะได้ไม่เพี้ยน
  targetCell.setValue(dateStr);
  targetCell.setFontWeight('bold');
  targetCell.setHorizontalAlignment('center');

  if (lastRow > 1) {
    let fillData = [];
    for (let i = 2; i <= lastRow; i++) {
      fillData.push(["-"]);
    }
    const dataRange = sheet.getRange(2, newColIndex, lastRow - 1, 1);
    dataRange.setValues(fillData);
    dataRange.setHorizontalAlignment('center');
  }
}

// ==========================================
// ฟังก์ชันของการตั้งค่า GPS
// ==========================================
function saveConfig(lat, lng, radius) {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  let sheet = ss.getSheetByName('Config');

  if (!sheet) {
    sheet = ss.insertSheet('Config');
    sheet.getRange('A1:B1').setValues([['Parameter', 'Value']]);
  }
  sheet.getRange('B2').setValue(lat);
  sheet.getRange('B3').setValue(lng);
  sheet.getRange('B4').setValue(radius);
  return { success: true, message: 'บันทึกการตั้งค่าพิกัดเรียบร้อย' };
}

function getConfig() {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  const sheet = ss.getSheetByName('Config');
  let config = { lat: 0, lng: 0, radius: 0.5 };
  if (sheet) {
    const latVal = sheet.getRange('B2').getValue();
    const lngVal = sheet.getRange('B3').getValue();
    const radiusVal = sheet.getRange('B4').getValue();
    if (latVal !== '') config.lat = parseFloat(latVal);
    if (lngVal !== '') config.lng = parseFloat(lngVal);
    if (radiusVal !== '') config.radius = parseFloat(radiusVal);
  }
  return config;
}

// ==========================================
// ฟังก์ชันสร้างคอลัมน์ล่วงหน้าอัตโนมัติ (Trigger เที่ยงคืน)
// ==========================================

function setupDailyTrigger() {
  const triggers = ScriptApp.getProjectTriggers();
  for (let i = 0; i < triggers.length; i++) {
    if (triggers[i].getHandlerFunction() === 'autoCreateDailyColumn') {
      ScriptApp.deleteTrigger(triggers[i]);
    }
  }

  ScriptApp.newTrigger('autoCreateDailyColumn')
    .timeBased()
    .everyDays(1)
    .atHour(0)
    .create();
    
  console.log("ติดตั้ง Trigger สร้างคอลัมน์ตอนเที่ยงคืนสำเร็จ!");
}

function autoCreateDailyColumn() {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  
  const sheetNames = ['Attendance', 'Grand_Summary']; 
  sheetNames.forEach(sheetName => {
    let currentSheet = ss.getSheetByName(sheetName);
    if (currentSheet) {
      moveResignedUsersToBottom(currentSheet);
    }
  });

  let attendanceSheet = ss.getSheetByName('Attendance');
  if (!attendanceSheet) {
    attendanceSheet = ss.insertSheet('Attendance');
    attendanceSheet.getRange(1, 1).setValue('Name').setFontWeight('bold');
  }

  const now = new Date();
  const timezone = ss.getSpreadsheetTimeZone();
  const dateStr = Utilities.formatDate(now, timezone, 'dd/MM/yyyy');

  const lastCol = Math.max(attendanceSheet.getLastColumn(), 1);
  const headersDisplay = attendanceSheet.getRange(1, 1, 1, lastCol).getDisplayValues()[0];

  let dateColIdx = -1;
  const targetYMD = parseUnifiedDate(dateStr);
  
  for (let j = 0; j < headersDisplay.length; j++) {
    const headerYMD = parseUnifiedDate(headersDisplay[j]);
    if ((targetYMD && headerYMD && targetYMD === headerYMD) || String(headersDisplay[j]).trim() === dateStr) {
      dateColIdx = j;
      break;
    }
  }

  if (dateColIdx === -1) {
    prepareDailyColumn(ss, attendanceSheet, dateStr);
  }
}

// ==========================================
// ฟังก์ชันย้ายพนักงานที่ Resigned ไปล่างสุด
// ==========================================
function moveResignedUsersToBottom(sheet) {
  const lastRow = sheet.getLastRow();
  const lastCol = Math.max(sheet.getLastColumn(), 1);
  
  if (lastRow <= 1) return;

  const dataRange = sheet.getRange(2, 1, lastRow - 1, lastCol);
  const data = dataRange.getValues();
  
  let activeRows = [];
  let resignedRows = [];

  for (let i = 0; i < data.length; i++) {
    const row = data[i];
    
    const isResigned = row.some(cell => {
      const cellStr = String(cell).trim().toLowerCase();
      return cellStr === 'resigned' || cellStr === 'ลาออก';
    });

    if (isResigned) {
      resignedRows.push(row);
    } else {
      activeRows.push(row);
    }
  }

  if (resignedRows.length > 0) {
    const newData = activeRows.concat(resignedRows);
    dataRange.setValues(newData);
  }
}
