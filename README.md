# ProjectVtuber

一年份的 Blender 每日學習計畫。零基礎起步，終點是一隻能在
[VtuberProject](https://github.com/YuutaTsubasa) (Unity + NiloToon) 裡
被 iPhone 臉部追蹤驅動的 3D Vtuber 模型。

## 怎麼用

開一個新的 Claude Code session，說：

> 今天繼續

Claude 會讀 `progress/STATUS.md`，找出你的下一個任務並帶你做。
做完存檔後回報，Claude 會用 headless Blender 檢查你的 `.blend` 檔，
通過才算完成、更新進度。

做不了的日子直接說一聲就好。**進度是以「完成的任務數」計算，不是日曆天**，
請假不會讓你落後，只會讓終點往後推。

## 結構

| 路徑 | 內容 |
|---|---|
| `curriculum/` | 課程內容（唯讀） |
| `progress/STATUS.md` | **單一真相來源**：目前進度、卡關、待補 |
| `progress/log/` | 每日記錄 |
| `tools/inspect_blend.py` | 驗收腳本 |
| `work/p1..p4/` | 你的 `.blend` 檔 |
| `docs/superpowers/specs/` | 設計規格 |

## 四個階段

| 階段 | 天數 | 畢業驗收 |
|---|---|---|
| P1 基礎 | Day 1–60 | 不看教學，獨立做出一個小物件並算圖 |
| P2 建模紮實化 | Day 61–150 | 拓樸乾淨的頭部 |
| P3 角色建模 | Day 151–240 | 原創角色完整 mesh |
| P4 Vtuber 化 | Day 241–312 | 在 Unity 裡被 iPhone 驅動 |

一週 6 天 + 1 天彈性，每日 30–60 分鐘，全年約 200–250 小時。

## 手動驗收

```bash
/Applications/Blender.app/Contents/MacOS/Blender -b work/p1/day01.blend --python tools/inspect_blend.py
```
