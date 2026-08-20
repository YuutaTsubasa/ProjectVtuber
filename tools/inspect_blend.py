"""Print objective observations about the currently opened .blend file.

This script is intentionally NOT a universal pass/fail grader. Daily Quest
acceptance criteria decide what matters; this report provides evidence.

Usage:
    blender -b work/p1/day01.blend --python tools/inspect_blend.py
"""

import bpy


def uv_summary(mesh):
    if not mesh.uv_layers:
        return "none"

    active = mesh.uv_layers.active
    if active is None or not active.data:
        return f"{len(mesh.uv_layers)} layer(s), active layer empty"

    coordinates = [tuple(round(component, 4) for component in item.uv) for item in active.data]
    unique = len(set(coordinates))
    return f"{len(mesh.uv_layers)} layer(s), {unique}/{len(coordinates)} unique loop coordinates"


print("\n" + "=" * 60)
print(f"Blender {bpy.app.version_string} | {bpy.data.filepath or '(unsaved)'}")
print("=" * 60)

meshes = [obj for obj in bpy.data.objects if obj.type == "MESH"]
armatures = [obj for obj in bpy.data.objects if obj.type == "ARMATURE"]

print(f"\nObjects: mesh={len(meshes)} armature={len(armatures)} total={len(bpy.data.objects)}")

for obj in meshes:
    mesh = obj.data
    triangles = sum(1 for polygon in mesh.polygons if len(polygon.vertices) == 3)
    quads = sum(1 for polygon in mesh.polygons if len(polygon.vertices) == 4)
    ngons = sum(1 for polygon in mesh.polygons if len(polygon.vertices) > 4)
    modifiers = [modifier.type for modifier in obj.modifiers]
    shape_keys = mesh.shape_keys.key_blocks if mesh.shape_keys else []

    print(f"\n-- MESH: {obj.name}")
    print(
        f"vertices={len(mesh.vertices)} faces={len(mesh.polygons)} "
        f"tri={triangles} quad={quads} ngon={ngons}"
    )
    print(f"UV: {uv_summary(mesh)}")
    print(f"materials={len(mesh.materials)} modifiers={', '.join(modifiers) or 'none'}")

    if shape_keys:
        print(f"shape_keys({len(shape_keys)}): {', '.join(key.name for key in shape_keys)}")

    if obj.vertex_groups:
        names = [group.name for group in obj.vertex_groups]
        preview = ", ".join(names[:12]) + (" ..." if len(names) > 12 else "")
        print(f"vertex_groups({len(names)}): {preview}")

for armature in armatures:
    bones = armature.data.bones
    roots = [bone.name for bone in bones if bone.parent is None]
    print(f"\n-- ARMATURE: {armature.name}")
    print(f"bones={len(bones)} roots={', '.join(roots) or 'none'}")

print("\nNote: topology counts are observations, not automatic errors.")
print("Interpret them using the current Daily Quest and deformation/shading context.")
print("=" * 60 + "\n")
