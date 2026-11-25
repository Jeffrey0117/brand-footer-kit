// ESM 入口。核心是 CJS（index.js），這裡只做轉接，讓 Astro / Next / Vite
// 這些 ESM 專案可以 `import createBrandFooter from 'brand-footer-kit'`。
import kit from './index.js';

export default kit;
export const createBrandFooter = kit.createBrandFooter;
export const pickTools = kit.pickTools;
export const escapeHtml = kit.escapeHtml;
export const isSafeUrl = kit.isSafeUrl;
export const sameHost = kit.sameHost;
