# Blender → 3D VTuber Curriculum Design

## Goal

從 Blender 零基礎開始，最終能獨立製作、理解並維護一隻可在 Unity 中以 iPhone 臉部追蹤驅動的 3D VTuber 模型。

這不是 312 天的固定影片播放清單，而是一套依能力驗收推進的學習系統。

## Core decisions

### Day N 是完成任務數

Day N 代表完成的第 N 個學習任務。Flex、休息、請假不占編號。這避免 streak 中斷造成「已經落後」的心理負擔。

### 先建立 Blender 操作直覺，再進完整教學專案

前兩週拆開 Viewport、Transform、Edit Mode、Extrude、Loop Cut、Inset、Bevel、Modifier、Material、Light、Camera。約 Day 15 才開始 Donut 或同級專案。

代價是前兩週的模型不華麗，因此 Day 13 特別安排 Presentation Quest：把簡單作品整理材質、燈光與相機並算圖，補回早期可見成就感。

### Transfer Quest 優先於重做相同作品

完全重做相同 tutorial 容易測到操作序列記憶。課程優先換物件，測試學習者能否把工具概念遷移到新問題。

### Assessment 是多證據判定

依序考慮 Daily Quest acceptance criteria、`.blend` 結構 observation、render/screenshot、以及學習者能否說明決策。

`tools/inspect_blend.py` 只提供客觀 observation，不宣稱能理解作品品質，也不自行決定 PASS/FAIL。

### Topology 是重要槓桿，不是唯一原因

P2 會大量練 topology / retopology，因為它影響 subdivision、deformation、weighting 與 shape key 工作量；但 rig placement、mesh density、weights、shape design 等也有獨立影響。

### 不採 n-gon == 0 教條

課程要求理解 n-gon 在 subdivision、deformation、shading 等情境的後果。靜態、平面且不受相關運算影響的位置，不因邊數本身自動判錯。

### 正式角色延後

P1–P2 主要使用可拋棄練習。正式 VTuber 角色在技能足以支持重做與修正後才投入，避免第一個角色變成捨不得推翻的技術債。

## Phases

- P1 Day 1–60：Blender 基礎、操作直覺、完整小作品 workflow。
- P2 Day 61–150：有機建模、Topology、Retopology、UV、Texture。
- P3 Day 151–240：Anime 角色、人體、頭部、頭髮、服裝、眼睛與完整 mesh。
- P4 Day 241–312：Rig、Weight、Facial Shape Keys、ARKit 52、物理、VRM / Unity / iPhone tracking。

## Adaptation rule

只提前細化近期課程。後期教材、Blender、Faceit、VRM、Unity 等工具都可能變動；接近階段時依當時 Stable 版本與前期實際學習表現更新細節，而不是一年以前寫死。
