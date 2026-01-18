# 部署至 Cloudflare Pages 指南

本專案使用 Vue 3 + Vite 建構，是標準的靜態網站，非常適合使用 **Cloudflare Pages** 進行免費且高效的託管。

以下是兩種設置方式：

## 方法一：連結 GitHub 自動部署 (最推薦)

這是最輕鬆的方式，每次您 Push 程式碼到 GitHub，Cloudflare 就會自動重新部署。

1. **準備 Git Repository**
   - 確保您的專案已推送到 GitHub (或 GitLab)。

2. **Cloudflare 設定**
   - 登入 [Cloudflare Dashboard](https://dash.cloudflare.com/)。
   - 在左側選單點擊 **Workers & Pages**。
   - 點擊 **Create application** 按鈕。
   - 選擇 **Pages** 標籤頁，然後點擊 **Connect to Git**。
   - 授權 Cloudflare 存取您的 GitHub 帳號，並選擇 `MathMonstersShooter` 專案庫。

3. **配置建構參數 (Build Settings)**
   - **Project name**: 預設即可 (如 `mathmonstersshooter`)。
   - **Production branch**: `main` (或是您的主分支名稱)。
   - **Framework preset**: 選擇 **`Vite`** (Cloudflare 會自動帶入預設值)。
   - 確認以下欄位：
     - **Build command**: `npm run build`
     - **Build output directory**: `dist`

4. **完成**
   - 點擊 **Save and Deploy**。
   - 等待約 1 分鐘，部署完成後您會獲得一個 `*.pages.dev` 的網址 (例如 `https://mathmonstersshooter.pages.dev`)，即可分享給朋友遊玩！

---

## 方法二：使用 Wrangler CLI 直接上傳

如果您不想設定 Git，也可以直接從電腦將編譯好的檔案上傳。

1. **安裝 Wrangler (Cloudflare CLI工具)**
   ```bash
   npm install -g wrangler
   ```

2. **登入 Cloudflare**
   ```bash
   npx wrangler login
   ```
   (這會開啟瀏覽器視窗讓您登入)

3. **編譯專案**
   在專案根目錄執行：
   ```bash
   npm run build
   ```
   這會產生一個 `dist` 資料夾。

4. **上傳部署**
   ```bash
   npx wrangler pages deploy dist --project-name math-monsters-shooter
   ```
   - 系統會詢問是否創建新專案，選 `y`。
   - 完成後會顯示由 Cloudflare 產生的網址。

## 常見問題

- **字型沒有顯示？**
  請確保您已將 `public/fonts/ZhuyinFont.ttf` 檔案提交到 Git (若使用方法一) 或包含在 `dist` 資料夾中 (方法二會自動包含)。因為此檔案是我們手動下載的，Git 預設不會忽略它，但需確認您有 `git add` 它。

- **重新整理出現 404？**
  本專案是單頁應用 (SPA)，但目前沒有使用 Vue Router，所以只有首頁。若未來加入路由，需在 Cloudflare Pages 加入 `_redirects` 檔案設定重導向。目前版本無需擔心此問題。
