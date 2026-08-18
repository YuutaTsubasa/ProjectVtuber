# ProjectVtuber — 一年 Blender 學習計畫

這個 repo 是一套**跨 session 的每日學習系統**。使用者是 Blender 零基礎，
目標是一年內做出一隻能在自己的 Unity 專案裡被 iPhone 驅動的 3D Vtuber 模型。

## 給 Claude 的操作規則

### 每次 session 開始

1. **先讀 `progress/STATUS.md`。** 那是唯一真相來源，記錄目前進度、上次卡在哪、待補項目。
2. 不要重讀整個 `progress/log/`，除非 STATUS 指向特定日期。
3. 使用者說「今天繼續」= 執行 STATUS 裡「下一個任務」欄位指的那一天。

### 帶課流程

1. 從 `curriculum/` 找出該日任務，**完整貼給使用者**（不要摘要，任務本身就是設計好的）。
2. 使用者做完後回報。若有 `.blend` 交付物，用 `tools/inspect_blend.py` 驗收：
   ```
   /Applications/Blender.app/Contents/MacOS/Blender -b <檔案> --python tools/inspect_blend.py
   ```
3. 驗收通過 → 更新 STATUS + 寫當日 log。未通過 → 指出具體問題，當天不算完成。

### 更新規則

- `curriculum/` **唯讀**。要改課程內容必須先跟使用者確認，且說明理由。
- `progress/STATUS.md` 每次完成任務後更新。
- `progress/log/YYYY-MM-DD.md` 追加，不覆寫。

### 進度計算

**Day N 是「完成的第 N 個任務」，不是日曆第 N 天。**
使用者請假不會造成「落後」，只會讓終點往後推。
不要用「你已經 X 天沒做了」這類話術施壓——那是這個計畫最主要的失敗模式。

### 教材原則

任務用**主題 + 驗收條件**描述，不寫死「Part N 的 12:30」。
教材更新時課程仍然有效。若使用者回報教材連結失效或內容對不上，回報並提議替代，不要硬套。

### 語言

使用者以繁體中文溝通，回覆用繁體中文。

## 環境

- Blender：見 STATUS.md 的「環境」欄（開始前需從 5.2.0 Alpha 換成正式版）
- 最終目標專案：`~/Repos/VtuberProject`（Unity 6000.3.6f1 + URP + NiloToon + iFacialMocap）
  - 該專案以 **ARKit 52 blendshape 名稱比對**驅動模型，這是 P4 的硬性規格
- 設計規格全文：`docs/superpowers/specs/2026-08-18-blender-one-year-curriculum-design.md`
