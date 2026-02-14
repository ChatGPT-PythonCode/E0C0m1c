# eoguides — React Archive (Vite)

No JSON. Images are displayed directly from `/public/img/comics/00.jpg` → `99.jpg`.

## Run locally
```bash
npm install
npm run dev
```

## Deploy to GitHub Pages
### Custom domain (eoguides.com)
- Keep `base: '/'` in `vite.config.js`
- Keep `public/CNAME` as `eoguides.com`

Deploy:
```bash
npm run deploy
```

### Project pages (github.io/<repo>/)
Set `base` in `vite.config.js` to `'/dddd/'` (your repo name), then deploy:
```bash
npm run deploy
```
