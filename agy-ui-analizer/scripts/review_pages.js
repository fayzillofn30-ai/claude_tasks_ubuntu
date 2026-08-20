// agy-ui-analizer — 1-bosqich (Executer/Agy zonasi, Gemini bilan bog'liq emas).
//
// Berilgan BASE_URL'dan boshlab saytni "kezib" (crawl), topilgan har bir
// sahifa uchun to'liq screenshot va brauzer konsol logini oladi.
// Yondashuv sababi: ../docs/design-rationale.md#1 (framework-agnostik
// crawling, config-parsing emas).
//
// Ishlatilishi:
//   node review_pages.js <BASE_URL> [OUTPUT_DIR] [MAX_PAGES]
//
// Natija: OUTPUT_DIR/<sahifa-slug>/screenshot.png va console.log,
// hamda OUTPUT_DIR/pages.json (topilgan barcha sahifalar ro'yxati).
const puppeteer = require("puppeteer");
const path = require("path");
const fs = require("fs");

function loadConfig() {
  const defaults = { MAX_PAGES: 50, CRAWL_NAV_TIMEOUT_MS: 30000 };
  const configPath = path.join(__dirname, "..", "config.env");
  if (!fs.existsSync(configPath)) return defaults;
  const content = fs.readFileSync(configPath, "utf-8");
  const config = { ...defaults };
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) continue;
    const [k, ...rest] = trimmed.split("=");
    const v = rest.join("=").trim().replace(/^["']|["']$/g, "");
    if (k.trim() in defaults) config[k.trim()] = parseInt(v, 10);
  }
  return config;
}

const config = loadConfig();
const BASE_URL = process.argv[2];
const OUTPUT_DIR = path.resolve(process.argv[3] || "./ui_review_output");
const MAX_PAGES = parseInt(process.argv[4] || String(config.MAX_PAGES), 10);
const NAV_TIMEOUT_MS = config.CRAWL_NAV_TIMEOUT_MS;

if (!BASE_URL) {
  console.error("Xatolik: BASE_URL berilmadi. Ishlatilishi: node review_pages.js <BASE_URL> [OUTPUT_DIR] [MAX_PAGES]");
  process.exit(1);
}

function slugify(urlStr) {
  const u = new URL(urlStr);
  const p = u.pathname === "/" || u.pathname === "" ? "index" : u.pathname.replace(/^\/|\/$/g, "").replace(/\//g, "__");
  return p || "index";
}

async function discoverPages(page, baseUrl, maxPages) {
  const baseOrigin = new URL(baseUrl).origin;
  const visited = new Set();
  const queue = [baseUrl];

  while (queue.length > 0 && visited.size < maxPages) {
    const url = queue.shift();
    const normalized = url.replace(/\/$/, "") || url;
    if (visited.has(normalized)) continue;

    await page.goto(url, { waitUntil: "networkidle0", timeout: NAV_TIMEOUT_MS });
    visited.add(normalized);

    const links = await page.evaluate(() =>
      Array.from(document.querySelectorAll("a[href]")).map((a) => a.href)
    );
    for (const link of links) {
      try {
        const u = new URL(link);
        if (u.origin !== baseOrigin) continue;
        const clean = u.origin + u.pathname;
        const cleanNorm = clean.replace(/\/$/, "") || clean;
        if (!visited.has(cleanNorm) && !queue.includes(clean)) {
          queue.push(clean);
        }
      } catch (_) {
        // href="#" yoki "javascript:..." kabi yaroqsiz URL'lar e'tiborsiz qoldiriladi
      }
    }
  }
  return [...visited];
}

async function capturePage(page, url, outDir) {
  fs.mkdirSync(outDir, { recursive: true });
  const consoleLines = [];
  const onConsole = (msg) => consoleLines.push(`[${msg.type()}] ${msg.text()}`);
  const onPageError = (err) => consoleLines.push(`[pageerror] ${err.message}`);
  const onReqFailed = (req) =>
    consoleLines.push(`[requestfailed] ${req.url()} — ${req.failure()?.errorText}`);

  page.on("console", onConsole);
  page.on("pageerror", onPageError);
  page.on("requestfailed", onReqFailed);

  await page.goto(url, { waitUntil: "networkidle0", timeout: NAV_TIMEOUT_MS });
  await page.screenshot({ path: path.join(outDir, "screenshot.png"), fullPage: true });

  page.off("console", onConsole);
  page.off("pageerror", onPageError);
  page.off("requestfailed", onReqFailed);

  const consoleLog = consoleLines.length > 0 ? consoleLines.join("\n") : "(konsolda hech qanday xabar yozilmadi)";
  fs.writeFileSync(path.join(outDir, "console.log"), consoleLog + "\n");
  return consoleLines.length;
}

async function main() {
  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900 });

  console.log(`🔍 Sahifalar aniqlanmoqda: ${BASE_URL} (max ${MAX_PAGES})...`);
  const pages = await discoverPages(page, BASE_URL, MAX_PAGES);
  console.log(`✅ ${pages.length} ta sahifa topildi:`);
  pages.forEach((p) => console.log(`   - ${p}`));

  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  const manifest = [];

  for (const url of pages) {
    const slug = slugify(url);
    const outDir = path.join(OUTPUT_DIR, slug);
    console.log(`\n📸 ${url} → ${slug}/`);
    const consoleErrorCount = await capturePage(page, url, outDir);
    manifest.push({
      url,
      slug,
      screenshot: path.join(slug, "screenshot.png"),
      console_log: path.join(slug, "console.log"),
      console_lines: consoleErrorCount,
    });
  }

  fs.writeFileSync(path.join(OUTPUT_DIR, "pages.json"), JSON.stringify(manifest, null, 2));
  await browser.close();

  console.log(`\n🎉 Tugadi. Natijalar: ${OUTPUT_DIR}/pages.json`);
}

main().catch((err) => {
  console.error("❌ Xatolik:", err);
  process.exit(1);
});
