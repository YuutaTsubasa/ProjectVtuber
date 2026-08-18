"""驗收腳本：無介面檢查 .blend 檔的客觀指標。

用法：
    /Applications/Blender.app/Contents/MacOS/Blender -b <檔案.blend> --python tools/inspect_blend.py
"""
import bpy

def uv_overlap_hint(mesh):
    """粗略偵測 UV 是否整層疊在原點（常見的「沒展 UV」狀態）。"""
    if not mesh.uv_layers:
        return "無 UV"
    uvs = [tuple(round(c, 4) for c in d.uv) for d in mesh.uv_layers.active.data]
    if not uvs:
        return "UV 層為空"
    uniq = len(set(uvs))
    return f"{len(mesh.uv_layers)} 層，{uniq}/{len(uvs)} 個相異座標" + (
        "  ← 疑似未展開" if uniq <= 4 else "")

print("\n" + "=" * 60)
print(f"Blender {bpy.app.version_string}   檔案：{bpy.data.filepath or '(未存檔)'}")
print("=" * 60)

meshes = [o for o in bpy.data.objects if o.type == 'MESH']
armatures = [o for o in bpy.data.objects if o.type == 'ARMATURE']

print(f"\n物件：mesh {len(meshes)} / armature {len(armatures)} / 總計 {len(bpy.data.objects)}")

for o in meshes:
    m = o.data
    ngon = sum(1 for p in m.polygons if len(p.vertices) > 4)
    tri = sum(1 for p in m.polygons if len(p.vertices) == 3)
    quad = sum(1 for p in m.polygons if len(p.vertices) == 4)
    sk = m.shape_keys.key_blocks if m.shape_keys else []
    mods = [f"{md.type}" for md in o.modifiers]

    print(f"\n── MESH: {o.name}")
    print(f"   頂點 {len(m.vertices)}  面 {len(m.polygons)}  (quad {quad} / tri {tri} / ngon {ngon})")
    if ngon:
        print(f"   ⚠ 有 {ngon} 個 n-gon（5 邊以上的面）——形變時容易出問題")
    print(f"   UV: {uv_overlap_hint(m)}")
    print(f"   材質: {len(m.materials)}  修改器: {', '.join(mods) or '無'}")
    if sk:
        print(f"   Shape Key ({len(sk)}): {', '.join(k.name for k in sk)}")
    if o.vertex_groups:
        print(f"   頂點群組 ({len(o.vertex_groups)}): {', '.join(g.name for g in o.vertex_groups[:12])}"
              + (" …" if len(o.vertex_groups) > 12 else ""))

for a in armatures:
    bones = a.data.bones
    roots = [b.name for b in bones if b.parent is None]
    print(f"\n── ARMATURE: {a.name}")
    print(f"   骨骼 {len(bones)}  根骨骼: {', '.join(roots)}")

print("\n" + "=" * 60 + "\n")
