#!/usr/bin/env node
// 重建 lectures/index.html —— 講義主頁。
//
// 掃描 lectures/p*/day*.html，從每頁抽出 Day 編號、標題、今日目標、建議時間、
// Quest 類型與驗收條目數，依階段分組輸出。只用 Node 內建模組，無外部相依。
//
// index.html 完全由這支腳本產生，手改會在下次執行時被覆蓋——要改主頁的樣子
// 就改這裡。
//
// 用法：node .claude/skills/daily-lecture/assets/build_index.mjs

import { readdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const REPO = resolve(dirname(fileURLToPath(import.meta.url)), '../../../..');
const LECTURES = join(REPO, 'lectures');

// 名稱與 Day 區間取自 curriculum/overview.md，改課程結構時要一起更新。
const PHASES = {
  p1: { name: 'P1 · Blender 基礎', range: [1, 60], blurb: '導航、Transform、Edit Mode、建模、Modifier、材質、打光、算圖' },
  p2: { name: 'P2 · 建模紮實化', range: [61, 150], blurb: '有機建模、拓樸、Retopology、UV、貼圖' },
  p3: { name: 'P3 · 角色建模', range: [151, 240], blurb: '人體比例、Anime 頭身、頭髮、服裝、眼睛、角色材質' },
  p4: { name: 'P4 · VTuber 化', range: [241, 312], blurb: 'Rig、Weight、Facial Shape Keys、ARKit 52、物理、VRM、Unity' },
};
const TOTAL_TASKS = 312;

const esc = (s) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const unesc = (s) =>
  s
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, '&');

// <title>Day 5 · Loop Cut · Inset · Bevel · ProjectVtuber</title>
//
// 標題本身可以含 ·（Day 5 就是），所以不能用非貪婪比對切在第一個分隔符——
// 那樣只會取到 "Loop Cut"。改成抓整段 title，剝掉開頭的 "Day N ·"
// 與結尾的 "· ProjectVtuber"，中間剩下的整段都算標題。
// 結尾後綴缺漏（例如 <title>Day 7 · Modifier 入門</title>）也照樣解析得出來。
function parseTitle(text) {
  const t = text.match(/<title>([\s\S]*?)<\/title>/i);
  if (!t) return null;
  const raw = unesc(t[1]).replace(/\s+/g, ' ').trim();
  const m = raw.match(/^Day\s*(\d+)\s*·\s*(.+)$/i);
  if (!m) return null;
  const title = m[2].replace(/\s*·\s*ProjectVtuber\s*$/i, '').trim();
  return title ? { day: Number(m[1]), title } : null;
}

// 主頁卡片上的資訊全部從講義頁本身抽出來，不另外維護一份清單——
// 那樣一定會和講義失去同步。抽不到的欄位就不顯示，不編造。
const pick = (text, re) => {
  const m = text.match(re);
  return m ? unesc(m[1]).replace(/\s+/g, ' ').trim() : null;
};

function parseMeta(text) {
  return {
    goal: pick(text, /<p class="goal">\s*<strong>[^<]*<\/strong>([\s\S]*?)<\/p>/i),
    duration: pick(text, /<span>建議時間\s*([^<]*)<\/span>/i),
    kind: pick(text, /<div class="meta">[\s\S]*?<span>([^<]*Quest[^<]*)<\/span>/i),
    criteria: (text.match(/<input type="checkbox"/g) || []).length,
    lectureId: pick(text, /'pv-lecture-([a-z0-9-]+)'/i),
  };
}

function collect() {
  const groups = new Map();
  const phases = readdirSync(LECTURES, { withFileTypes: true })
    .filter((d) => d.isDirectory() && /^p\d+$/.test(d.name))
    .map((d) => d.name)
    .sort();

  for (const phase of phases) {
    for (const file of readdirSync(join(LECTURES, phase)).sort()) {
      if (!/^day\d+\.html$/.test(file)) continue;
      const rel = `${phase}/${file}`;
      const text = readFileSync(join(LECTURES, rel), 'utf8');
      const info = parseTitle(text);
      if (!info) {
        // 靜默跳過會讓該天從目錄消失、指令卻回報成功。標記失敗讓它看得見。
        console.error(`跳過（<title> 應為「Day N · 標題 · ProjectVtuber」）：lectures/${rel}`);
        process.exitCode = 1;
        continue;
      }
      if (!groups.has(phase)) groups.set(phase, []);
      groups.get(phase).push({ day: info.day, title: info.title, rel, ...parseMeta(text) });
    }
    groups.get(phase)?.sort((a, b) => a.day - b.day);
  }
  return groups;
}

function dayCard({ day, title, rel, goal, duration, kind, criteria, lectureId }) {
  const meta = [duration, kind].filter(Boolean).map((s) => `<span>${esc(s)}</span>`).join('');
  return `      <li>
        <a class="day-card" href="${esc(rel)}"${lectureId ? ` data-lecture="${esc(lectureId)}" data-criteria="${criteria}"` : ''}>
          <span class="badge">Day ${day}</span>
          <span class="body">
            <span class="title">${esc(title)}</span>
            ${goal ? `<span class="goal">${esc(goal)}</span>` : ''}
            ${meta ? `<span class="meta">${meta}</span>` : ''}
          </span>
          <span class="prog" hidden></span>
        </a>
      </li>`;
}

function render(groups) {
  let total = 0;
  const sections = [];

  for (const key of Object.keys(PHASES)) {
    const items = groups.get(key) ?? [];
    const { name, range, blurb } = PHASES[key];
    total += items.length;

    const head = `    <div class="phase-head">
      <h2>${esc(name)}</h2>
      <p class="range">Day ${range[0]}–${range[1]}　·　${esc(blurb)}</p>
    </div>`;

    const list = items.length
      ? `    <ul>\n${items.map(dayCard).join('\n')}\n    </ul>`
      : `    <p class="empty">這個階段還沒有講義。輪到它的時候會用 <code>daily-lecture</code> 產生。</p>`;

    sections.push(`  <section class="phase${items.length ? '' : ' future'}">\n${head}\n${list}\n  </section>`);
  }

  const body = sections.join('\n');
  const next = total ? `已產生 ${total} 份講義，涵蓋 Day 1–${total}。` : '還沒有任何講義。';

  return `<!doctype html>
<html lang="zh-Hant">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>講義目錄 · ProjectVtuber</title>
<style>
:root{
  --bg:#f7f5f1; --surface:#fffdfa; --surface-2:#f0ece5; --line:#ddd6ca;
  --text:#221f1a; --muted:#6b6459; --accent:#d2691e; --accent-soft:#fbe9d7; --ok:#2f7d4f;
}
@media (prefers-color-scheme:dark){
  :root{
    --bg:#17161a; --surface:#201e24; --surface-2:#2a272e; --line:#3a3641;
    --text:#eae6e0; --muted:#a29b93; --accent:#f0954a; --accent-soft:#3a2a1c; --ok:#79d19b;
  }
}
*{box-sizing:border-box}
html{-webkit-text-size-adjust:100%}
body{margin:0;padding:0 1.1rem 5rem;background:var(--bg);color:var(--text);
  font-family:"Noto Sans TC","Hiragino Sans","Microsoft JhengHei",system-ui,-apple-system,sans-serif;
  font-size:17px;line-height:1.8;letter-spacing:.01em}
.wrap{max-width:52rem;margin:0 auto}

header.hero{padding:2.6rem 0 1.6rem;border-bottom:2px solid var(--line);margin-bottom:.6rem}
.eyebrow{display:inline-block;font-size:.78rem;letter-spacing:.14em;color:var(--accent);
  background:var(--accent-soft);padding:.2rem .7rem;border-radius:999px;font-weight:700}
h1{font-size:clamp(1.7rem,5vw,2.3rem);margin:.7rem 0 .4rem;line-height:1.25}
.sub{color:var(--muted);margin:0}
.sub strong{color:var(--text)}

.phase{margin:2.6rem 0}
.phase.future{opacity:.62}
.phase-head h2{font-size:1.18rem;margin:0}
.phase-head .range{color:var(--muted);font-size:.87rem;margin:.15rem 0 .9rem}
.phase-head{padding-bottom:.4rem;border-bottom:1px solid var(--line);margin-bottom:.9rem}

ul{list-style:none;padding:0;margin:0}
a.day-card{display:flex;gap:.9rem;align-items:flex-start;text-decoration:none;color:inherit;
  background:var(--surface);border:1px solid var(--line);border-radius:12px;
  padding:.85rem 1rem;margin:.5rem 0;transition:border-color .15s,transform .15s}
a.day-card:hover{border-color:var(--accent);transform:translateX(2px)}
a.day-card:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
.badge{flex:0 0 auto;font-weight:700;font-size:.78rem;color:var(--accent);background:var(--accent-soft);
  border-radius:999px;padding:.15rem .65rem;margin-top:.2rem;font-variant-numeric:tabular-nums;white-space:nowrap}
.body{flex:1 1 auto;min-width:0;display:flex;flex-direction:column}
.title{font-weight:700;line-height:1.5}
.goal{color:var(--muted);font-size:.92rem;line-height:1.6;margin-top:.1rem}
.meta{display:flex;flex-wrap:wrap;gap:.3rem .8rem;color:var(--muted);font-size:.8rem;margin-top:.35rem}
.prog{flex:0 0 auto;align-self:center;font-size:.78rem;font-variant-numeric:tabular-nums;
  color:var(--muted);border:1px solid var(--line);border-radius:999px;padding:.1rem .55rem;white-space:nowrap}
.prog.done{color:var(--ok);border-color:var(--ok)}
.empty{color:var(--muted);font-size:.92rem;margin:.2rem 0}
code{font-family:ui-monospace,Menlo,Consolas,monospace;font-size:.86em;
  background:var(--surface-2);border:1px solid var(--line);border-radius:5px;padding:.05rem .3rem}
footer{margin-top:3.5rem;padding-top:1.1rem;border-top:1px solid var(--line);color:var(--muted);font-size:.84rem}
@media (max-width:480px){
  body{font-size:16px;padding:0 .85rem 4rem}
  a.day-card{gap:.7rem;padding:.75rem .85rem}
  .prog{display:none}
}
</style>
</head>
<body>
<div class="wrap">

<header class="hero">
  <span class="eyebrow">Blender → 3D VTuber</span>
  <h1>ProjectVtuber 講義</h1>
  <p class="sub"><strong>Day N = 完成的第 N 個學習任務</strong>，不是日期，也不是連續打卡。休息與 Flex Day 不占編號。</p>
</header>

${body}

<footer>
  <p>${next}共 ${TOTAL_TASKS} 個任務。進度以 <code>progress/STATUS.md</code> 為準——本頁的勾選只是各講義存在這台裝置瀏覽器裡的暫存。</p>
  <p>本頁由 <code>build_index.mjs</code> 產生，請勿手動編輯。</p>
</footer>

</div>
<script>
// 各講義的勾選狀態存在自己的 localStorage key 裡。同源時這裡讀得到，
// 就把進度顯示出來；讀不到（例如以 file:// 開啟、瀏覽器隔離每個檔案）
// 就安靜略過，不顯示假資料。
(function () {
  var cards = [].slice.call(document.querySelectorAll('a.day-card[data-lecture]'));
  cards.forEach(function (a) {
    var total = parseInt(a.getAttribute('data-criteria'), 10);
    if (!total) return;
    var raw;
    try { raw = localStorage.getItem('pv-lecture-' + a.getAttribute('data-lecture')); } catch (e) { return; }
    if (!raw) return;
    var state;
    try { state = JSON.parse(raw); } catch (e) { return; }
    if (!state || typeof state !== 'object' || Array.isArray(state)) return;
    var done = Object.keys(state).filter(function (k) { return state[k]; }).length;
    var el = a.querySelector('.prog');
    el.textContent = done + ' / ' + total;
    el.hidden = false;
    if (done >= total) el.className = 'prog done';
  });
})();
</script>
</body>
</html>
`;
}

if (!existsSync(LECTURES)) {
  console.error(`找不到 ${LECTURES}`);
  process.exit(1);
}
const out = join(LECTURES, 'index.html');
writeFileSync(out, render(collect()), 'utf8');
console.log('已更新 lectures/index.html');
