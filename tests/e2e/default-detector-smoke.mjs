import { createHash } from "node:crypto";
import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright-core";

const testDirectory = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(testDirectory, "../..");
const fixturePath = path.join(
  projectRoot,
  "tests/fixtures/mediapipe-thumb-up.jpg",
);
const mediaPipeDirectory = path.join(
  projectRoot,
  "node_modules/@mediapipe/hands",
);
const baseUrl = "http://127.0.0.1:4178";
const localizedTestUrl = `${baseUrl}/zh-TW/`;
const pinnedCdnPrefix =
  "/npm/@mediapipe/hands@0.4.1675469240/";
const expectedAssets = [
  "hand_landmark_full.tflite",
  "hands.binarypb",
  "hands_solution_packed_assets.data",
  "hands_solution_packed_assets_loader.js",
  "hands_solution_simd_wasm_bin.js",
  "hands_solution_simd_wasm_bin.wasm",
].sort();
const expectedFixtureHash =
  "5d673c081ab13b8a1812269ff57047066f9c33c07db5f4178089e8cb3fdc0291";

function requireCondition(condition, message) {
  if (!condition) throw new Error(message);
}

function findChrome() {
  const candidates = [
    process.env.CHROME_PATH,
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/usr/bin/google-chrome",
    "/usr/bin/google-chrome-stable",
    "/usr/bin/chromium",
    "/usr/bin/chromium-browser",
  ].filter(Boolean);

  const installed = candidates.find((candidate) => fs.existsSync(candidate));
  if (installed) return installed;

  const bundled = chromium.executablePath();
  requireCondition(
    fs.existsSync(bundled),
    "No Chrome/Chromium executable found. Set CHROME_PATH to run this smoke.",
  );
  return bundled;
}

function contentTypeFor(fileName) {
  if (fileName.endsWith(".js")) return "application/javascript";
  if (fileName.endsWith(".wasm")) return "application/wasm";
  return "application/octet-stream";
}

async function waitForPreview(preview, output) {
  const deadline = Date.now() + 10_000;

  while (Date.now() < deadline) {
    if (preview.exitCode !== null) {
      throw new Error(`Vite preview exited early.\n${output.join("")}`);
    }

    try {
      const response = await fetch(baseUrl);
      if (response.ok) return;
    } catch {
      // The owned preview process is still starting.
    }

    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  throw new Error(`Timed out waiting for Vite preview.\n${output.join("")}`);
}

async function stopPreview(preview) {
  if (preview.exitCode !== null) return;

  preview.kill("SIGTERM");
  await Promise.race([
    new Promise((resolve) => preview.once("exit", resolve)),
    new Promise((resolve) => setTimeout(resolve, 2_000)),
  ]);

  if (preview.exitCode === null) preview.kill("SIGKILL");
}

async function main() {
  const fixtureHash = createHash("sha256")
    .update(fs.readFileSync(fixturePath))
    .digest("hex");
  requireCondition(
    fixtureHash === expectedFixtureHash,
    `Known-hand fixture hash changed: ${fixtureHash}`,
  );

  const mediaPipePackage = JSON.parse(
    fs.readFileSync(path.join(mediaPipeDirectory, "package.json"), "utf8"),
  );
  requireCondition(
    mediaPipePackage.version === "0.4.1675469240",
    `Unexpected @mediapipe/hands version: ${mediaPipePackage.version}`,
  );

  const output = [];
  const preview = spawn(
    process.execPath,
    [
      path.join(projectRoot, "node_modules/vite/bin/vite.js"),
      "preview",
      "--host",
      "127.0.0.1",
      "--port",
      "4178",
      "--strictPort",
    ],
    { cwd: projectRoot, stdio: ["ignore", "pipe", "pipe"] },
  );
  preview.stdout.on("data", (chunk) => output.push(chunk.toString()));
  preview.stderr.on("data", (chunk) => output.push(chunk.toString()));

  let browser;
  try {
    await waitForPreview(preview, output);
    browser = await chromium.launch({ executablePath: findChrome(), headless: true });
    const page = await browser.newPage();
    const requestedAssets = new Set();
    const blockedExternalRequests = [];
    const pageErrors = [];
    page.on("pageerror", (error) => pageErrors.push(error.message));

    await page.route("**/*", async (route) => {
      const requestUrl = new URL(route.request().url());

      if (requestUrl.origin === baseUrl) {
        await route.continue();
        return;
      }

      if (
        requestUrl.origin === "https://cdn.jsdelivr.net" &&
        requestUrl.pathname.startsWith(pinnedCdnPrefix)
      ) {
        const fileName = requestUrl.pathname.slice(pinnedCdnPrefix.length);
        requireCondition(
          expectedAssets.includes(fileName),
          `Unexpected MediaPipe asset request: ${fileName}`,
        );
        const localAsset = path.join(mediaPipeDirectory, fileName);
        requireCondition(
          path.dirname(localAsset) === mediaPipeDirectory &&
            fs.existsSync(localAsset),
          `Pinned local MediaPipe asset is missing: ${fileName}`,
        );
        requestedAssets.add(fileName);
        await route.fulfill({
          status: 200,
          contentType: contentTypeFor(fileName),
          body: fs.readFileSync(localAsset),
        });
        return;
      }

      blockedExternalRequests.push(requestUrl.href);
      await route.abort("blockedbyclient");
    });

    const response = await page.goto(localizedTestUrl, { waitUntil: "domcontentloaded" });
    requireCondition(response?.status() === 200, "Built home route was not HTTP 200.");

    await page.locator('input[type="file"]').first().setInputFiles(fixturePath);
    const successMessage = "已偵測到 21 個手部關節，可以選擇反思卡。";
    await page.getByText(successMessage, { exact: true }).waitFor({
      state: "visible",
      timeout: 30_000,
    });

    requireCondition(pageErrors.length === 0, `Browser errors: ${pageErrors.join(" | ")}`);
    requireCondition(
      JSON.stringify([...requestedAssets].sort()) === JSON.stringify(expectedAssets),
      `MediaPipe asset set differed: ${JSON.stringify([...requestedAssets].sort())}`,
    );

    console.log(
      JSON.stringify(
        {
          result: "default detector produced one validated 21-landmark hand",
          builtUrl: localizedTestUrl,
          fixture: {
            file: path.relative(projectRoot, fixturePath),
            sha256: fixtureHash,
          },
          mediaPipeVersion: mediaPipePackage.version,
          interceptedLocalAssets: [...requestedAssets].sort(),
          blockedExternalRequestCount: blockedExternalRequests.length,
          visibleSuccess: successMessage,
        },
        null,
        2,
      ),
    );
  } finally {
    await browser?.close();
    await stopPreview(preview);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
