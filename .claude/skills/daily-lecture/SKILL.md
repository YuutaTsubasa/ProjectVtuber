---
name: daily-lecture
description: Use when the learner is about to start a ProjectVtuber learning day and needs the lecture page for it, asks for 今天的講義 / 教學網頁 / handout for Day N, or asks to regenerate or fix an existing lecture page under lectures/.
---

# Daily Lecture Page

## Overview

把 curriculum 裡某一天的條列敘述，展開成一頁可離線開啟的引導式講義網頁。

核心原則：**講義是導航，不是代做。** 主線只給「要達成什麼」，完整按鍵步驟一律鎖在 `<details class="answer">` 裡，由學習者自己決定何時展開。

## When to Use

- 使用者說「開始 Day N」「今天要學什麼」「給我今天的講義」。
- 使用者要求補做或重做某一天的講義頁。
- 使用者要求調整既有講義（補步驟、修錯字、換教材連結）。

不要用在：更新 `progress/STATUS.md`、判定任務通過與否、寫課程大綱本身。這些是 CLAUDE.md 的職責，講義只呈現 curriculum 已經決定的內容。

## Workflow

1. **讀真相來源。** 先 `progress/STATUS.md` 確認目前階段與下一個任務，再讀對應的 `curriculum/p<N>-*.md` 找出該 Day 的原文段落。不要靠對話記憶推測進度。
2. **確認 Day 存在。** curriculum 沒有明確寫到那一天（例如 Day 15–30 只有區間敘述），先向使用者確認今天要做的具體題目，再產生講義。不要自行發明課程內容。
3. **複製模板。** 以 `assets/template.html` 為基底，輸出到 `lectures/p<N>/day<NN>.html`（兩位數補零，例如 `lectures/p1/day07.html`）。
4. **填完所有 `{{...}}` 佔位符。** 交付前全文搜尋 `{{`，必須為零。重複區塊（概念卡、快捷鍵列、步驟、驗收項、症狀、常見錯誤、回報題）依需要複製或刪除，模板註解寫了每一塊的數量範圍。
5. **重建索引。** 執行 `node .claude/skills/daily-lecture/assets/build_index.mjs`，更新 `lectures/index.html`。
6. **交回連結。** 用 SendUserFile 送出該 HTML（`display: "render"`），並附一句今日目標。不要在對話裡把講義內容再複述一遍。

## Required Sections

模板的九個 section 是契約，順序與存在與否都不可改：

| # | Section | 內容 |
|---|---|---|
| 01 | 為什麼今天要學這個 | 先講解決什麼問題。此節禁止出現快捷鍵表 |
| 02 | 核心概念 | 2–4 張卡：是什麼 → 何時用 → 常見誤解 |
| 03 | 今日快捷鍵 | 三欄；「解決什麼問題」欄不可留空或寫「同左」 |
| 04 | 今日 Quest | 逐字沿用 curriculum 的 Quest；無遷移挑戰就刪掉那張 warn 卡 |
| 05 | 操作流程 | 5–9 步，主線只寫目標＋提示，按鍵鎖在 answer 摺疊 |
| 06 | 驗收標準 | 有原文就逐字沿用；沒有就依「驗收標準的來源」推導並標示 |
| 07 | 卡住了？ | 3–5 個症狀，第一層自我診斷，第二層才是答案 |
| 08 | 常見錯誤 | 常見做法 / 為什麼有問題 / 改成 |
| 09 | 完成後回報 | 3 題，至少一題問「為什麼這樣選」 |

若某一天真的沒有第 08 節的素材，仍保留節標題並寫出至少一列真實會踩的錯，不要留空表格。

## 驗收標準的來源

curriculum 只有少數日子寫了 `Acceptance Criteria`——P1 的 14 天裡只有 Day 1 有，Day 4／14 是「通關條件」、Day 6 是「回報」，其餘十天什麼都沒有。但第 06 節是不可刪的契約，所以多數日子必須推導。沒有規則的話，每一天的標準都會不一樣。

1. **有原文就逐字沿用。** 一條不增不減，連措辭都不要改寫。
2. **沒有原文時，只能從當日的 Quest 與「重點／通關條件／回報」句推導。** 不得引入這些句子以外的新要求——包含看起來很合理的補充限制。「只使用 primitives」就寫「只使用 primitives」，不要自行補上「不准進 Edit Mode」。
3. **存檔路徑固定算一條**，不視為加碼。第 09 節的自檢指令需要它。
4. **遷移挑戰不得寫成必過條件。** 它本來就允許失敗，失敗是討論材料。真要放進驗收，寫成「你嘗試過，並能說出判斷過程（做出來或卡住都算）」這種不判定成敗的形式。
5. **推導出來的要標示。** 在 `<ul class="check">` 前加一行：

   ```html
   <p class="lede">本日 curriculum 未列 Acceptance Criteria，以下由當日 Quest 與重點句推導。</p>
   ```

   學習者有權知道哪些是課程原文、哪些是講義的推論。

想追加原文與 Quest 都沒有的要求，先在對話裡說明理由並取得同意，不要直接寫進講義。

## Content Rules

繼承 CLAUDE.md 的教學規則，寫講義時具體化成：

- **繁體中文。** Blender 介面名詞保留英文原文（Edit Mode、Loop Cut、Principled BSDF），不要自創翻譯。
- **只寫今天。** 不預告後續階段的知識。提到未來只能一句話帶過。
- **問題先於按鍵。** 每個工具都要先說它解決什麼形狀／流程問題。
- **主線不給完整答案。** 步驟的 `.what` 描述目標（「把杯壁做出厚度」），`.hint` 給方向（「想想從哪個 face 往外長」），按鍵與選單路徑只出現在摺疊區內。
- **驗收不加碼。** 詳見上面的「驗收標準的來源」。原文有就照抄，沒有就只從 Quest 與重點句推導，並標示那是推導。
- **n-gon 不一律當錯。** 若提到拓樸，說明它在什麼情境下才有後果。
- **教材連結先驗證。** 引用外部教學（Donut 等）前確認連結與版本仍有效；失效就選同級替代並提醒把理由記進 STATUS。
- **時間誠實。** `{{DURATION}}` 寫實際跟做時間，不是影片長度。零基礎跟做 20 分鐘教材花 60 分鐘是正常的。

## Placeholders

| 佔位符 | 範例 |
|---|---|
| `{{DAY}}` | `7` |
| `{{PHASE}}` | `P1 · Blender 基礎` |
| `{{TITLE}}` | `Modifier 入門` |
| `{{DURATION}}` | `40–60 分鐘` |
| `{{BLEND_PATH}}` | `work/p1/day07.blend` |
| `{{QUEST_KIND}}` | `建模 Quest` / `遷移 Quest` / `Presentation Quest` |
| `{{LECTURE_ID}}` | `p1-day07`（localStorage key，全站唯一） |
| `{{INSPECT_CMD}}` | `blender -b work/p1/day07.blend --python tools/inspect_blend.py` |

其餘 `{{...}}` 為內容欄位，語意見模板內註解。

## Common Mistakes

| 症狀 | 問題 | 改成 |
|---|---|---|
| 步驟主線寫「按 <kbd>E</kbd> 往上拉」 | 學習者照抄不思考 | 主線寫「把杯壁往上延伸」，按鍵放摺疊區 |
| 快捷鍵表放在第 01 節 | 違反「先問題後按鍵」 | 第 01 節只講問題情境 |
| 驗收條目比 curriculum 多 | 偷改課程標準 | 逐條對應，要改先討論 |
| 從 Quest 推導卻沒標示 | 學習者分不出原文與推論 | 加上「本日 curriculum 未列…」那一行 |
| 遷移挑戰寫成必過條件 | 卡住就被判定沒過，抵消它允許失敗的用意 | 改成「嘗試過並能說明判斷過程」 |
| 說 operator 面板點掉就叫不回來 | 學習者白做一輪 Undo 重來 | 補上 <kbd>F9</kbd> 可叫回 Adjust Last Operation |
| `{{CONCEPT_TITLE}}` 之類殘留 | 沒填完模板 | 交付前搜尋 `{{` 必須為零 |
| 兩天用同一個 `{{LECTURE_ID}}` | 勾選狀態互相覆蓋 | 一天一個唯一 id |
| 講義寫完又在對話複述全文 | 浪費且雙份真相 | 只給連結＋一句今日目標 |

## Verification

交付前實際檢查，不要憑印象宣告完成。把路徑換成這次產生的那一天：

```bash
grep -o "{{" lectures/p1/day01.html | wc -l
```

輸出 0 才算填完。不要改用 `grep -c`——計數為 0 時它的 exit code 是 1，填得完全正確反而會被當成指令失敗。

索引重建必須以 exit 0 結束：

```bash
node .claude/skills/daily-lecture/assets/build_index.mjs
```

非零代表有講義的 `<title>` 不符合 `Day N · 標題 · ProjectVtuber`，那一天已經從目錄被跳過，要先修好標題再重跑。

最後用 Browser 開啟一次，確認勾選會累積進度條、`全部展開` 有作用、手機寬度不橫向捲動。
