"""Convert a SketchUp STL export into the files std-shelf.html loads.

Usage:
    pip install numpy numpy-stl scipy
    python std-shelf/tools/stl_to_shelf.py "Indoor Rack.stl" std-shelf/indoor-rack

Writes <out_dir>/model.bin and <out_dir>/parts.json, then add an entry to
std-shelf/shelves.json pointing at <out_dir>/.

Input: binary or ASCII STL exported from SketchUp in centimetres (SketchUp's default).
Parts are separated by connectivity and sorted into three groups the viewer can toggle:
  roller : roller wheels (~40 x 40 x 25 mm), axles (~37 x 4 x 4 mm), roller rails (~515 mm long, <10 mm thick)
  bin    : any part whose smallest side is over 300 mm (a box), plus every part that sits inside a box
  frame  : everything else (aluminium profiles, brackets)
Adjust classify() if a new shelf uses different roller tracks.

model.bin  : little-endian float32 triangles (x, y, z per vertex), Y up, centred on the floor,
             sorted frame -> roller -> bin, each part contiguous.
parts.json : {"unit": "cm", "extent_mm": [depth, length, height], "tris": N,
              "parts": [{"c": group, "s": first triangle, "n": triangle count, "d": [x, y, z] size in mm}]}
"""
import json
import os
import sys

import numpy as np
from scipy.sparse import coo_matrix
from scipy.sparse.csgraph import connected_components
from stl import mesh as stlmesh


def classify(size, bbox, boxes):
    s = np.sort(size)[::-1]
    is_wheel = abs(s[0] - 4) < 0.3 and abs(s[2] - 2.5) < 0.3
    is_axle = abs(s[0] - 3.7) < 0.3 and s[1] < 0.6
    is_rail = abs(s[0] - 51.5) < 0.5 and s[2] < 1
    if is_wheel or is_axle or is_rail:
        return "roller"
    if s[2] > 30:
        return "bin"
    lo, hi = bbox
    for blo, bhi in boxes:
        if np.all(lo >= blo - 1.5) and np.all(hi <= bhi + 1.5):
            return "bin"
    return "frame"


def main(stl_path, out_dir):
    tri = stlmesh.Mesh.from_file(stl_path).vectors.astype(np.float64)  # (n, 3, 3), cm, Z up
    flat = tri.reshape(-1, 3)
    _, vid = np.unique(np.round(flat * 1000).astype(np.int64), axis=0, return_inverse=True)
    vid = vid.reshape(-1, 3)
    n = vid.max() + 1
    rows = np.concatenate([vid[:, 0], vid[:, 1], vid[:, 2]])
    cols = np.concatenate([vid[:, 1], vid[:, 2], vid[:, 0]])
    k, label = connected_components(coo_matrix((np.ones(len(rows)), (rows, cols)), shape=(n, n)), directed=False)
    tri_comp = label[vid[:, 0]]

    bbox = [(tri[tri_comp == i].reshape(-1, 3).min(0), tri[tri_comp == i].reshape(-1, 3).max(0)) for i in range(k)]
    size = [b[1] - b[0] for b in bbox]
    boxes = [bbox[i] for i in range(k) if np.sort(size[i])[0] > 30]
    group = {i: classify(size[i], bbox[i], boxes) for i in range(k)}

    lo, hi = flat.min(0), flat.max(0)
    ctr = (lo + hi) / 2
    world = tri - np.array([ctr[0], ctr[1], lo[2]])
    world = np.stack([world[..., 0], world[..., 2], -world[..., 1]], -1)  # Z up -> Y up

    order, parts, start = [], [], 0
    for g in ("frame", "roller", "bin"):
        for i in range(k):
            if group[i] != g:
                continue
            idx = np.where(tri_comp == i)[0]
            order.append(idx)
            parts.append({"c": g, "s": start, "n": int(len(idx)), "d": [round(float(v) * 10, 1) for v in size[i]]})
            start += len(idx)
    order = np.concatenate(order)

    os.makedirs(out_dir, exist_ok=True)
    world[order].astype("<f4").tofile(os.path.join(out_dir, "model.bin"))
    with open(os.path.join(out_dir, "parts.json"), "w") as f:
        json.dump({"unit": "cm", "extent_mm": [round(float(e) * 10, 1) for e in (hi - lo)],
                   "tris": int(len(order)), "parts": parts}, f, separators=(",", ":"))
    counts = {g: sum(1 for p in parts if p["c"] == g) for g in ("frame", "roller", "bin")}
    print(f"{len(order)} triangles, {k} parts {counts}, size {np.round((hi - lo) * 10)} mm -> {out_dir}")


if __name__ == "__main__":
    if len(sys.argv) != 3:
        sys.exit(__doc__)
    main(sys.argv[1], sys.argv[2])
