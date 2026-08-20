#!/usr/bin/env node
// 重建 lectures/index.html。
//
// 掃描 lectures/p*/day*.html，從每頁的 <title> 取出 Day 編號與標題，
// 依階段分組輸出一頁講義目錄。只用 Node 內建模組，無外部相依。
//
// 用法：node .claude/skills/daily-lecture/assets/build_index.mjs

import { readdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const REPO = resolve(dirname(fileURLToPath(import.meta.url)), '../../../..');
const LECTURES = join(REPO, 'lectures');

const PHASE_NAMES = {
  p1: 'P1 · Blender 基礎',
  p2: 'P2 · 建模紮實化',
  p3: 'P3 · 角色建模',
  p4: 'P4 · VTuber 化',
};

const esc = (s) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const unesc = (s) =>
  s
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, '&');

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
      const m = text.match(/<title>\s*Day\s*(\d+)\s*·\s*([\s\S]+?)\s*·/i);
      if (!m) {
        console.error(`跳過（<title> 格式不符）：lectures/${rel}`);
        continue;
      }
      if (!groups.has(phase)) groups.set(phase, []);
      groups.get(phase).push({ day: Number(m[1]), title: unesc(m[2]), rel });
    }
    groups.get(phase)?.sort((a, b) => a.day - b.day);
  }
  return groups;
}

function render(groups) {
  let total = 0;
  const parts = [];
  for (const [phase, items] of groups) {
    parts.push(`<h2>${esc(PHASE_NAMES[phase] ?? phase)}</h2>`, '<ul>');
    for (const { day, title, rel } of items) {
      total++;
      parts.push(
        `<li><a href="${esc(rel)}"><span class="day">Day ${day}</span><span>${esc(title)}</span></a></li>`,
      );
    }
    parts.push('</ul>');
  }
  const body = total ? parts.join('\n') : '<p class="empty">還沒有任何講義。</p>';

  return `<!doctype html>
<html lang="zh-Hant">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>講義目錄 · ProjectVtuber</title>
<style>
:root{--bg:#f7f5f1;--surface:#fffdfa;--line:#ddd6ca;--text:#221f1a;--muted:#6b6459;--accent:#d2691e;--accent-soft:#fbe9d7}
@media (prefers-color-scheme:dark){:root{--bg:#17161a;--surface:#201e24;--line:#3a3641;--text:#eae6e0;--muted:#a29b93;--accent:#f0954a;--accent-soft:#3a2a1c}}
*{box-sizing:border-box}
body{margin:0;padding:0 1.1rem 4rem;background:var(--bg);color:var(--text);
font-family:"Noto Sans TC","Hiragino Sans","Microsoft JhengHei",system-ui,sans-serif;line-height:1.8}
.wrap{max-width:48rem;margin:0 auto}
h1{font-size:1.9rem;margin:2.4rem 0 .3rem}
.sub{color:var(--muted);margin:0 0 2rem}
h2{font-size:1.1rem;margin:2.4rem 0 .8rem;padding-bottom:.35rem;border-bottom:1px solid var(--line)}
ul{list-style:none;padding:0;margin:0}
li a{display:flex;gap:.85rem;align-items:baseline;text-decoration:none;color:inherit;
background:var(--surface);border:1px solid var(--line);border-radius:10px;padding:.7rem .95rem;margin:.45rem 0}
li a:hover{border-color:var(--accent)}
.day{flex:0 0 auto;font-weight:700;font-size:.8rem;color:var(--accent);background:var(--accent-soft);
border-radius:999px;padding:.1rem .6rem;font-variant-numeric:tabular-nums}
.empty{color:var(--muted)}
footer{margin-top:3rem;padding-top:1rem;border-top:1px solid var(--line);color:var(--muted);font-size:.85rem}
</style>
</head>
<body><div class="wrap">
<h1>ProjectVtuber 講義</h1>
<p class="sub">Day N = 完成的第 N 個學習任務，不是日期。</p>
${body}
<footer>共 ${total} 份講義。由 build_index.mjs 產生，請勿手動編輯。</footer>
</div></body>
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
