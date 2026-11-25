# brand-footer-kit

**站群品牌 footer — 把一人開發者的各個站互相連起來。** 零依賴、框架無關。

一個人做了十幾個站，每個站都是孤島：訪客用完就走，搜尋引擎也看不出這些站是同一個人做的。
這個 kit 在每個站底下掛同一個品牌區，連到其他幾個站和作品站——訪客會順著逛，站群之間也有了真實的互連。

## 為什麼是回傳字串，不是 React 元件

連結必須在**建置期**就寫進 HTML。用 JS 在瀏覽器抓清單再塞進 DOM，爬蟲多半看不到，
整件事的 SEO 價值就沒了。回字串的話 Astro、Express 樣板、Next、11ty、純靜態產生器都能用，
而且**一定**是靜態的——沒有「不小心做成 client-side」這個失敗模式。

## 安裝

```bash
npm i github:Jeffrey0117/brand-footer-kit   # 或直接複製 index.js
```

## 用法

```js
const createBrandFooter = require('brand-footer-kit');

const footer = createBrandFooter({
  brand: {
    name: 'htmlcat 切版職人',
    shortName: 'htmlcat',
    tagline: '一個人做一整套自己的工具',
    home: 'https://example.com/apps/',      // 作品站（hub）
    github: 'https://github.com/example',
    foundedYear: 2019,
  },
  // 站群的完整清單 —— 放一份，各站共用
  tools: [
    { name: 'Pokkit', blurb: '丟檔案拿短網址', url: 'https://example.com/pokkit/' },
    { name: 'RawTxt', blurb: '貼文字拿網址',   url: 'https://example.com/rawtxt/' },
    // …
  ],
});

const html = footer.html({
  currentUrl: 'https://speed.example.org/',  // 當前站：排除自己 + 決定輪替起點
  limit: 6,
  nav: [{ label: '測速', href: '/' }, { label: '部落格', href: '/blog' }],
  note: '，本站是其中一個。',
});

const css = footer.css();
```

### Astro

```astro
---
import createBrandFooter from 'brand-footer-kit';
import { brand, tools } from '../data/brand';

const footer = createBrandFooter({ brand, tools });
const html = footer.html({ currentUrl: Astro.site.href, nav: [...] });
---
<Fragment set:html={html} />
<style is:global set:html={footer.css()}></style>
```

### Express + 任何樣板

```js
app.locals.brandFooter = footer.html({ currentUrl: process.env.PUBLIC_URL });
// 樣板裡：<%- brandFooter %>
```

### Next.js（app router）

```jsx
const footer = createBrandFooter({ brand, tools });
export default function Footer() {
  return <div dangerouslySetInnerHTML={{ __html: footer.html({ currentUrl: SITE }) }} />;
}
```
內容是你自己的設定檔，不是使用者輸入；而且名稱與文案都會經過 escape。

## API

### `createBrandFooter(config)`

| 欄位 | 型別 | 說明 |
|---|---|---|
| `brand.name` | string | **必填。** 品牌全名，顯示在品牌區標題 |
| `brand.home` | string | **必填。** 作品站網址，必須是 http(s) 絕對網址 |
| `brand.shortName` | string | 著作權那行用的短名，沒有就用 `name` |
| `brand.tagline` | string | 品牌名下面那句 |
| `brand.github` | string | 有才會出現 GitHub 連結 |
| `brand.foundedYear` | number | 著作權起始年，顯示成 `2019–<今年>` |
| `tools` | Array | 站群清單 `{ name, blurb, url }` |
| `prefix` | string | CSS class 前綴，預設 `bfk`。跟既有樣式衝突時改這個 |
| `year` | number | 當前年份，預設 `new Date().getFullYear()`（測試時固定用） |

### `footer.html(options) -> string`

| 欄位 | 預設 | 說明 |
|---|---|---|
| `currentUrl` | — | 當前站網址。**同 host 的工具會被排除**，同時當輪替種子 |
| `limit` | `6` | 顯示幾個工具。`<=0` 表示全列 |
| `nav` | — | 站內導覽 `[{ label, href }]`，放在品牌區上方 |
| `note` | — | 接在 `tagline` 後面的一句話 |
| `moreLabel` / `moreBlurb` | `看全部作品` | 最後那格「連到作品站」的文字 |

### `footer.css() -> string`

預設樣式，全部吃 CSS 變數（`--bfk-fg`、`--bfk-muted`、`--bfk-line`、`--bfk-card`、`--bfk-accent`）。
深色模式就在自己的 `[data-theme=dark]` 底下覆寫那幾個變數，不必重寫規則。
不想用就別呼叫，自己寫——HTML 的 class 名稱是穩定介面。

### `footer.pick(options) -> Array`

只要挑選結果不要 HTML 時用（例如自己刻版）。參數同 `currentUrl` / `limit` / `seed`。

## 輪替是怎麼運作的

`limit` 小於清單長度時，從 `seed`（通常就是 `currentUrl`）算出的位置開始取，繞一圈。

- **不同站看到不同工具** → 整體曝光平均，不會十個站都只推同樣那六個
- **同一個站每次 build 結果一樣** → 不用亂數。否則每次部署 footer 連結都在變，
  對爬蟲是雜訊，build 產物的 diff 也會一直髒

## 安全與韌性

- 名稱、文案、網址全部 HTML escape
- 只放行 `http:` / `https:` 絕對網址；`javascript:`、`data:`、相對路徑一律安靜丟掉
  （站群連結一定是跨站的，出現相對路徑通常代表資料填錯，連到錯的地方更糟）
- `brand.name` 或 `brand.home` 缺漏／格式錯 → 直接 throw，不要等上線才發現 footer 是空的

## 跑範例

```bash
node example.js
```

## 相關

- **JSON-LD（Organization / FAQPage / Article…）請用 [`seo-schema-kit`](https://github.com/Jeffrey0117/seo-schema-kit)**，這個 kit 不碰結構化資料
- Linktree 式的 link-in-bio 頁面是 [`bio-kit`](https://github.com/Jeffrey0117/bio-kit)，跟站群 footer 不同件事

## License

MIT © Jeffrey0117
