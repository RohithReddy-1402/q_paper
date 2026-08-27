import { chromium } from "playwright-core";
import express from "express";
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, "..");
const distDir = path.join(rootDir, "dist");
const PORT = 5943;

const coursesInfo = JSON.parse(
  fs.readFileSync(
    path.join(rootDir, "src/components/syllabus-data/courses-info.json"),
    "utf8",
  ),
);

const staticRoutes = [
  "/nit-kkr-pyqs",
  "/nit-kkr/about",
  "/nit-kkr/tech-stack",
  "/nit-kkr/privacy-policy",
  "/nit-kkr/contact",
  "/nit-kkr/donate",
];

const courseRoutes = coursesInfo.map((c) => `/nit-kkr/syllabus/${c.route}`);

const branchSemesterRoutes = [
  "/nit-kkr/syllabus/branch",
  "/nit-kkr/syllabus/branch/robotics-automation",
  ...[1, 2, 4, 5].map(
    (n) => `/nit-kkr/syllabus/branch/robotics-automation/semester/${n}`,
  ),
  "/nit-kkr/syllabus/branch/computer-science-engineering",
  ...[1, 2, 3, 4, 5, 6, 7, 8].map(
    (n) => `/nit-kkr/syllabus/branch/computer-science-engineering/semester/${n}`,
  ),
  "/nit-kkr/syllabus/branch/artificial-intelligence-machine-learning",
  ...[1, 2, 3, 4, 5, 6, 7, 8].map(
    (n) => `/nit-kkr/syllabus/branch/artificial-intelligence-machine-learning/semester/${n}`,
  ),
];

const routes = [...staticRoutes, ...courseRoutes, ...branchSemesterRoutes];

function findChromium() {
  if (process.env.PRERENDER_CHROMIUM_PATH) return process.env.PRERENDER_CHROMIUM_PATH;
  const candidates = [
    "/usr/bin/chromium-browser",
    "/usr/bin/chromium",
    "/usr/bin/google-chrome",
    "/usr/bin/google-chrome-stable",
  ];
  return candidates.find((p) => fs.existsSync(p));
}

async function main() {
  if (!fs.existsSync(distDir)) {
    console.error("[prerender] dist/ not found - run `vite build` first.");
    process.exit(1);
  }

  const app = express();
  app.use(express.static(distDir));
  app.get("/{*splat}", (req, res) => res.sendFile(path.join(distDir, "index.html")));
  const server = app.listen(PORT);

  const executablePath = findChromium();
  let browser;
  try {
    browser = await chromium.launch(executablePath ? { executablePath } : {});
  } catch (err) {
    console.warn(
      "[prerender] No usable Chromium found - skipping prerender step.\n" +
        "  Set PRERENDER_CHROMIUM_PATH, or install one via `npx playwright install chromium`.",
    );
    server.close();
    return;
  }
  const page = await browser.newPage();

  let ok = 0;
  let failed = [];

  for (const route of routes) {
    try {
      await page.goto(`http://localhost:${PORT}${route}`, {
        waitUntil: "networkidle",
        timeout: 20000,
      });
      // Give React a moment past networkidle for the final paint/state settle.
      await page.waitForTimeout(300);

      const rootHTML = await page.$eval("#root", (el) => el.innerHTML).catch(() => "");
      if (!rootHTML || rootHTML.trim().length === 0) {
        failed.push({ route, reason: "empty #root" });
        continue;
      }

      const html = await page.content();
      const outDir = path.join(distDir, route.replace(/^\//, ""));
      fs.mkdirSync(outDir, { recursive: true });
      fs.writeFileSync(path.join(outDir, "index.html"), html);
      ok++;
    } catch (err) {
      failed.push({ route, reason: err.message });
    }
  }

  await browser.close();
  server.close();

  console.log(`[prerender] Done. ${ok}/${routes.length} routes prerendered.`);
  if (failed.length) {
    console.log("[prerender] Failed routes:");
    for (const f of failed) console.log(`  - ${f.route}: ${f.reason}`);
  }
}

main();
