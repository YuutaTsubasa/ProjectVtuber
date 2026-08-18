# P1 · Blender 基礎（Day 1–60）

## 目標

不是快速完成某個教學，而是建立 Blender 的操作直覺。

P1 畢業時，看到一個簡單物件應該能自行判斷：要從什麼 primitive 開始、哪裡 Extrude、哪裡 Loop Cut、何時用 Bevel / Mirror / Subdivision，以及如何給材質、打光、架相機並算圖。

## 前兩週：Blender 新手村

### Day 1 — Viewport 與 Transform

學習：Viewport 導航、選取、G / R / S、前/側/上視圖、儲存與 Undo。

Quest：加入 Cube、Sphere、Cylinder，將三者移到不同位置、旋轉角度與尺寸。

Acceptance Criteria：
- 能不看筆記切換主要正交視角。
- 能選取指定物件並使用 G / R / S。
- `work/p1/day01.blend` 至少有 3 個不同 mesh。

### Day 2 — 用 Primitive 組合造型

學習：Add、Duplicate、Object Mode、Local / Global Transform 的基本概念。

Quest：只使用 primitives 做一個簡單機器人或雪人。不要追求漂亮。

遷移挑戰：最後再加入一個你自己決定的零件，不照任何步驟。

### Day 3 — Edit Mode

學習：Object Mode vs Edit Mode、Vertex / Edge / Face、選取模式。

Quest：從 Cube 開始做一張非常簡單的桌子。

重點不是桌子，而是理解「改物件」與「改 mesh」是兩件不同的事。

### Day 4 — Extrude

學習：Extrude、Axis Constraint、基本 Face 操作。

Quest A：跟著範例做一個簡單杯子/容器。

Quest B（遷移）：不看步驟，用 Extrude 做一把非常簡單的低模劍。

通關條件：知道「需要從既有幾何延伸形狀」時會主動想到 Extrude。

### Day 5 — Loop Cut / Inset / Bevel

學習：Loop Cut、Inset、Bevel，以及它們各自解決什麼形狀問題。

Quest：做一個簡單寶箱或盒子。

### Day 6 — 第一個無教學 Quest

不看完整教學，自選「杯子、簡單椅子、小櫃子、低模劍、花盆」其中一個重新從零完成。

可以查快捷鍵與單一功能，但不能跟著完整作品影片一步一步做。

回報：哪些操作可以直接想到？哪些必須查？

### Flex / Rest Day

補課、自由玩 Blender 或完全休息。

**不編 Day number、不增加 completed task count。**

### Day 7 — Modifier 入門

學習：Modifier 是非破壞式操作；Mirror、Bevel。

Quest：製作一個左右對稱的小物件，例如簡單盾牌。

### Day 8 — Subdivision Surface

學習：Subdivision、支撐線、為什麼 Subdivision 後形狀會改變。

Quest：把簡單 blockout 改成圓潤造型。

不要背參數；重點是理解 base mesh 與 evaluated result 的差別。

### Day 9 — Proportional Editing

學習：比例編輯與有機形狀調整。

Quest：從簡單 mesh 捏出不完全規則的石頭、水滴或簡化頭型。

### Day 10 — Transform / Modeling 綜合遷移

不看作品教學完成一個指定小物件。

必須至少使用：
- Edit Mode
- Extrude
- Loop Cut 或 Inset
- Bevel 或 Modifier

允許查「某功能怎麼按」，不允許查「如何做這個物件」。

### Day 11 — Material 基礎

學習：Material、Principled BSDF、Base Color、Roughness、Metallic。

Quest：替之前做的物件建立至少 3 種能肉眼辨識差異的材質。

### Day 12 — Light

學習：World Light、Point / Area Light、亮度、方向與陰影。

Quest：同一個物件做至少兩種不同氣氛的打光。

### Day 13 — Camera 與 Render

學習：Camera、構圖、焦距基本概念、Render。

Quest：替自己的小物件完成一張正式算圖。

### Day 14 — 新手村 Boss

從零做一個以前沒有跟著教學做過的小物件。

限制：
- 不看完整作品教學。
- 可以查 Blender 功能文件。
- 必須自行決定 primitive、建模流程、材質、燈光與相機。

通關條件不是「漂亮」，而是能解釋自己為什麼使用這些工具。

## Day 15–30：第一個整合專案

Day 15 左右才開始 Blender Guru Donut 或同級完整 beginner project。

此時 Donut 的目的不是第一次介紹所有 Blender 操作，而是把已學過的 Modeling / Modifier / Material / Lighting / Camera 串成完整 workflow。

每完成一個新概念，下一個任務優先安排不同物件的遷移練習，而不是單純把同一段 Donut 再背一次。

## Day 31–45：獨立小作品

逐步加入：精確尺寸、Origin / Pivot、Apply Transform、Snapping、更多 Modifier、UV 基礎。

至少完成 3 個不同類型的小物件，避免只熟悉單一 tutorial workflow。

## Day 46–52：UV / Texture 基礎

學習 seam、unwrap、UV island、簡單 texture workflow。

重點是為 P2 與角色製作建立概念，不追求專業貼圖師深度。

## Day 53–60：P1 Boss Project

自選一個非教學指定的小物件，從 blockout → modeling → UV → material → lighting → camera → render 完成。

### P1 畢業標準

- 不依賴完整作品教學。
- 能說明主要建模決策。
- 沒有明顯會造成 shading / subdivision 問題的拓樸。
- 不要求機械式 `n-gon == 0`；應理解 n-gon 出現的位置及其後果。
- 有合理 UV、材質、打光、相機與最終 render。

未達標就延長 P1，不以日曆日期強迫升級。
