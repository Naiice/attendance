# STD Shelf — ชั้นวางมาตรฐาน 3D

หน้า `std-shelf.html` แสดงโมเดล 3 มิติของชั้นวางมาตรฐาน หมุน / ซูม / ซ่อนชิ้นส่วน และแตะชิ้นงานเพื่อดูขนาดได้
เปิดจากเมนู **STD Shelf** ใน sidebar (`sidebar.js`) ลิงก์ตรงไปยังชั้นวางแต่ละแบบได้ด้วย `std-shelf.html#<id>` เช่น `std-shelf.html#indoor-rack`

## โครงสร้างไฟล์

```
std-shelf.html              หน้าแสดงผล 3D
std-shelf/shelves.json      รายการชั้นวางทั้งหมด (ปุ่มเลือกในหน้าเว็บ)
std-shelf/<id>/model.bin    รูปทรงโมเดล (สร้างจากสคริปต์)
std-shelf/<id>/parts.json   ตารางชิ้นส่วน + ขนาด (สร้างจากสคริปต์)
std-shelf/tools/stl_to_shelf.py   สคริปต์แปลง STL -> model.bin + parts.json
```

## เพิ่มชั้นวางใหม่

1. เปิดไฟล์ใน SketchUp → **File → Export → 3D Model…** เลือก **STL** (หน่วย cm ตามค่าเริ่มต้น)
2. แปลงไฟล์:
   ```bash
   pip install numpy numpy-stl scipy
   python std-shelf/tools/stl_to_shelf.py "My Shelf.stl" std-shelf/my-shelf
   ```
3. เพิ่มรายการใน `std-shelf/shelves.json`:
   ```json
   {
     "id": "my-shelf",
     "name": "My Shelf",
     "type": "Flow Rack",
     "desc_th": "คำอธิบายภาษาไทย",
     "desc_zh": "中文说明",
     "profile": "Bosch Rexroth 40×40",
     "folder": "std-shelf/my-shelf/",
     "updated": "2026-11-26"
   }
   ```
4. commit + push ขึ้น `main` แล้ว Netlify จะ deploy ให้อัตโนมัติ

สคริปต์แบ่งชิ้นส่วนเป็น 3 กลุ่ม (โครง / รางลูกกลิ้ง / กล่อง) จากขนาดของชิ้นส่วน
ถ้าชั้นวางใหม่ใช้รางลูกกลิ้งขนาดอื่น ให้แก้ฟังก์ชัน `classify()` ในสคริปต์
