---
name: brand-footer-kit
description: 要在站底下掛品牌、連到自己其他站時用。使用者說「footer 放我的品牌」「把工具連起來」「培養腦粉」「其他站也要有」，或在做個人站群的 footer / 導流 / 互連時觸發。只管 footer 的 HTML 與 CSS，JSON-LD 歸 seo-schema-kit。
---

# brand-footer-kit — 打法

**站群品牌 footer：把一人開發者的各個站互相連起來。回 HTML 字串，建置期就定案。**

## 何時觸發

- 使用者說「這種工具底下要擺我們的品牌」「連結各種工具」「培養腦粉」「其他站也加一下」
- 某個站的 footer 只有一行 `© 20XX 站名`，而這個人明明還有別的站
- 新站上線、要接進既有站群

**不要在這些情況用**：單一產品公司的官網 footer（那是一般切版，不是站群互連）、
Linktree 式的 link-in-bio 頁面（那是 `bio-kit`）。

## 接線（照抄能跑）

1. `npm i github:Jeffrey0117/brand-footer-kit`（或內嵌 copy `index.js`）
2. 專案裡建一個 `src/data/brand.(ts|js)` 放 `brand` 與 `tools`，**只有這一個檔能改清單**
3. layout 呼叫 `createBrandFooter({ brand, tools }).html({ currentUrl: <本站網址> })`，
   把回傳字串原樣塞進 HTML；`.css()` 塞進 `<style>`
4. build 完 **grep 產物確認連結在靜態 HTML 裡**：
   `grep -o 'href="https://[^"]*"' dist/index.html | sort -u`
   —— 看不到就是接錯了（做成 client-side 了），這個 kit 的全部價值就在這一步

## 模式與文案

- **hub-and-spoke，不要全列。** 每頁 6 個左右 + 一格「看全部作品」連到作品站。
  每頁塞 20 個外連會稀釋權重、看起來像 link farm，footer 還會比內容長。
  完整清單是作品站的事。
- **挑「這個站的訪客真的會點的」，不是「我最自豪的」。** 測速站的訪客是一般人，
  給他 Pokkit（丟檔案）、截圖工具會點；給他 `auth-kit` 不會。
- **blurb 用中文 6–10 字、動詞開頭**：「丟檔案拿短網址」「純文字變好讀」。
  不要寫「一個強大的檔案分享平台」——那是官網文案，不是 footer 文案。
- **`note` 把本站接回品牌**：`tagline` + `'，本站是其中一個。'` 讀起來才像一句話。
- **一定要傳 `currentUrl`**：不傳就會連到自己，而且所有站的輪替起點都一樣。
- **連公開的專案頁，不要連自架服務的直連網址**（見下方地雷）。

## 地雷

- ⚠️ **連結必須在建置期寫死。** 用 `fetch` 在瀏覽器抓 `tools.json` 再塞 DOM，爬蟲看不到，
  SEO 價值歸零。要「改一份全站更新」就在**建置期**拉清單（prebuild script），不是 runtime。
- ⚠️ **自架服務的主機名別寫進 public repo。** 站群清單很容易順手填自架網域，
  一旦那個 repo 是公開的就等於公開自己的基礎設施位置。連對外的專案介紹頁
  （GitHub Pages / 作品站）比較安全，權重也更集中。
- `footer.css()` 的 class 前綴預設 `bfk`。接進舊站如果撞到既有 `footer a { margin: 0 15px }`
  這類全域規則，改 `prefix` 或在自己的樣式裡把那塊收回來。
- 深色模式**只覆寫 CSS 變數**（`--bfk-fg` 那幾個），不要整段重寫規則，否則下次 kit 升級就脫節。
- `brand.home` 填錯格式會直接 throw —— 這是故意的，比上線後 footer 空白好。
