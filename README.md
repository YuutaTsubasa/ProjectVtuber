# ProjectVtuber

一年份的 Blender → 3D VTuber 學習系統。

目標不是「把 Blender 教學看完」，而是讓操作逐漸變成直覺，最後能從零完成一隻可在 Unity 中被 iPhone 臉部追蹤驅動的 3D VTuber 模型。

## 課程設計

- 每個學習日約 30–60 分鐘。
- Day N 代表「完成的第 N 個學習任務」，不是日曆日期。
- Flex / Rest Day 不占 Day 編號，也不計入已完成任務數。
- 前期先建立 Blender 操作肌肉記憶，再進入 Donut 等整合型作品。
- 每個階段都有可驗收的能力目標，而不是只看是否跟完影片。

## 四個階段

| 階段 | 任務範圍 | 重點 | 畢業驗收 |
|---|---:|---|---|
| P1 Blender 基礎 | Day 1–60 | 導航、Transform、Edit Mode、基本建模、Modifier、材質、打光、算圖 | 不看教學獨立完成一個小物件並算圖 |
| P2 建模紮實化 | Day 61–150 | 有機建模、拓樸、Retopology、UV、貼圖 | 完成一顆拓樸乾淨、可繼續製作角色的頭部 |
| P3 角色建模 | Day 151–240 | 人體比例、Anime 頭身、頭髮、服裝、眼睛、角色材質 | 原創角色完整 mesh |
| P4 VTuber 化 | Day 241–312 | Rig、Weight、Facial Shape Keys、ARKit 52、物理、VRM、Unity | 在 Unity 中被 iPhone 驅動 |

## 前期教學哲學

P1 的前兩週不急著做 Donut。先用簡單小物件練熟最常用的 Blender 操作，等 G / R / S、Edit Mode、Extrude、Loop Cut、Bevel、Modifier 等開始形成直覺後，再把 Donut 當成第一個「整合專案」。

跟著影片完成作品不等於學會。因此課程固定穿插「遷移任務」：昨天學 Extrude，今天就換一個完全不同的物件，確認你能自己判斷何時需要 Extrude。

## 驗收

`tools/inspect_blend.py` 只負責輸出可客觀觀察的 Blender 資訊，例如 mesh 數、拓樸統計、UV、材質、Modifier、Shape Key、骨架等。

它不是萬能的自動評分器。每個 Daily Quest 自己定義 acceptance criteria，由客觀檢查結果 + 模型畫面 + 使用者回報共同判定通過與否。
