'use strict';

/**
 * node example.js
 *
 * 示範三件事：同一份清單在不同站拿到不同工具、不會連到自己、輪替是穩定的。
 */

const createBrandFooter = require('./index.js');

// 站群共用的一份清單。實務上放在一個地方（repo / JSON），各站建置期讀它。
const tools = [
  { name: 'Pokkit', blurb: '丟檔案拿短網址', url: 'https://example.com/pokkit/' },
  { name: 'RawTxt', blurb: '貼文字拿網址', url: 'https://example.com/rawtxt/' },
  { name: 'Readdy', blurb: '純文字變好讀', url: 'https://example.com/readdy/' },
  { name: 'SpeakSlow', blurb: '本機中文語音輸入', url: 'https://example.com/speakslow/' },
  { name: 'DuckShot', blurb: '截圖加文字辨識', url: 'https://example.com/duckshot/' },
  { name: 'SimPPT', blurb: 'Markdown 直接當簡報', url: 'https://example.com/simppt/' },
  { name: 'MySpeedTest', blurb: '5 秒測完網速', url: 'https://speed.example.org/' },
  { name: 'Selfize', blurb: '自架 SQLite REST API', url: 'https://example.com/selfize/' },
];

const footer = createBrandFooter({
  brand: {
    name: 'htmlcat 切版職人',
    shortName: 'htmlcat',
    tagline: '一個人做一整套自己的工具',
    home: 'https://example.com/apps/',
    github: 'https://github.com/example',
    foundedYear: 2019,
  },
  tools,
  year: 2026, // 固定年份，讓這份輸出可重現
});

console.log('── 測速站看到的（不會出現 MySpeedTest 自己）──');
console.log(
  footer
    .pick({ exclude: 'https://speed.example.org/', seed: 'https://speed.example.org/', limit: 4 })
    .map((t) => t.name)
    .join(', ')
);

console.log('\n── 另一個站看到的（起點不同）──');
console.log(
  footer
    .pick({ exclude: 'https://notes.example.org/', seed: 'https://notes.example.org/', limit: 4 })
    .map((t) => t.name)
    .join(', ')
);

console.log('\n── 同一個站再跑一次，結果必須一樣 ──');
const once = footer.pick({ exclude: 'https://speed.example.org/', seed: 'https://speed.example.org/', limit: 4 });
const twice = footer.pick({ exclude: 'https://speed.example.org/', seed: 'https://speed.example.org/', limit: 4 });
console.log(JSON.stringify(once) === JSON.stringify(twice) ? '一樣 ✅（建置結果可重現）' : '不一樣 ❌');

console.log('\n── 壞資料會被安靜吃掉 ──');
const risky = createBrandFooter({
  brand: { name: 'x', home: 'https://example.com/', foundedYear: 2026 },
  tools: [
    { name: 'javascript 協定', blurb: '會被擋', url: 'javascript:alert(1)' },
    { name: '相對路徑', blurb: '會被擋', url: '/relative' },
    { name: '正常的', blurb: '留下', url: 'https://ok.example.com/' },
  ],
  year: 2026,
});
console.log(risky.pick({ limit: 10 }).map((t) => t.name).join(', ') || '(空)');

console.log('\n── HTML（節錄）──');
const html = footer.html({
  currentUrl: 'https://speed.example.org/',
  limit: 3,
  nav: [
    { label: '測速', href: '/' },
    { label: '部落格', href: '/blog' },
  ],
  note: '，本站是其中一個。',
});
console.log(html.slice(0, 420) + ' …');

console.log('\n── 名稱含 HTML 字元會被 escape ──');
const escaped = createBrandFooter({
  brand: { name: 'A & B <script>', home: 'https://example.com/', foundedYear: 2026 },
  tools: [],
  year: 2026,
}).html({});
console.log(escaped.includes('<script>') ? '沒 escape ❌' : '有 escape ✅');

console.log('\n── CSS 長度 ──');
console.log(footer.css().length + ' bytes（可直接 inline 進 <style>）');
