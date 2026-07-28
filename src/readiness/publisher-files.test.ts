// @vitest-environment node
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath, pathToFileURL } from "node:url";
import { describe, expect, it } from "vitest";
import { ADS_TXT_RECORD, LAST_UPDATED, PUBLISHER_ID, SITE_ORIGIN } from "@/config/site-metadata";
import { PUBLIC_PATHS } from "@/config/public-routes";
import { buildLocalizedPath, SUPPORTED_LOCALES } from "@/i18n/locales";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const read = (file: string) => fs.readFileSync(path.join(root, file), "utf8");

function collectRelativeFiles(directory: string, base = directory): string[] {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const absolutePath = path.join(directory, entry.name);

    return entry.isDirectory()
      ? collectRelativeFiles(absolutePath, base)
      : [path.relative(base, absolutePath)];
  });
}

function collectBuiltText(): string {
  const textExtensions = /\.(?:css|html|js|json|svg|txt|webmanifest|xml)$/i;

  return collectRelativeFiles(path.join(root, "dist"))
    .filter((relativePath) => textExtensions.test(relativePath))
    .map((relativePath) => read(path.join("dist", relativePath)))
    .join("\n");
}

function readJpegDimensions(bytes: Buffer): { width: number; height: number } | undefined {
  let offset = 2;

  while (offset < bytes.length) {
    if (bytes[offset] !== 0xff) return undefined;
    while (bytes[offset] === 0xff) offset += 1;

    const marker = bytes[offset];
    offset += 1;
    if (marker === 0xd8 || marker === 0xd9 || (marker >= 0xd0 && marker <= 0xd7)) continue;
    if (offset + 1 >= bytes.length) return undefined;

    const length = bytes.readUInt16BE(offset);
    if (length < 8 || offset + length > bytes.length) return undefined;
    if (marker >= 0xc0 && marker <= 0xc3) {
      return {
        height: bytes.readUInt16BE(offset + 3),
        width: bytes.readUInt16BE(offset + 5),
      };
    }
    offset += length;
  }
}

describe("publisher and crawl files", () => {
  it("ships truthful HandFuture install metadata", () => {
    const manifest = JSON.parse(read("public/site.webmanifest"));

    expect(manifest).toMatchObject({
      name: "HandFuture｜手相文化探索與手部偵測",
      short_name: "HandFuture",
      description:
        "從文化角度認識手相傳統，使用瀏覽器內的手部關節偵測選擇一張非科學、僅供娛樂與自我反思的提示卡。",
      start_url: "/",
      lang: "zh-TW",
    });
  });

  it("copies every public asset byte-for-byte into the built site", () => {
    const staticAssets = collectRelativeFiles(path.join(root, "public")).filter(
      (relativePath) => relativePath !== "sitemap.xml",
    );

    for (const relativePath of staticAssets) {
      expect(
        fs.readFileSync(path.join(root, "dist", relativePath)),
        relativePath,
      ).toEqual(fs.readFileSync(path.join(root, "public", relativePath)));
    }
  });

  it("does not ship the retired image-filter interface", () => {
    expect(collectBuiltText()).not.toMatch(
      /image-filter-storage|\.filter-panel|\.filter-preset-active|\.download-ready/,
    );
  });

  it("ships a real 1200 by 630 JPEG social image", () => {
    const bytes = fs.readFileSync(path.join(root, "public/og-image.jpg"));

    expect([...bytes.subarray(0, 3)]).toEqual([0xff, 0xd8, 0xff]);
    expect(bytes.byteLength).toBeGreaterThan(20_000);
    expect(readJpegDimensions(bytes)).toEqual({ width: 1200, height: 630 });
    expect(read("src/config/site-metadata.ts")).toContain(`${SITE_ORIGIN}/og-image.jpg`);
  });

  it("has the exact AdSense record and final newline", () => {
    expect(read("public/ads.txt")).toBe(`${ADS_TXT_RECORD}\n`);
  });

  it("regenerates exactly the 64 localized canonical URLs in deterministic order", () => {
    const temporaryDirectory = fs.mkdtempSync(path.join(os.tmpdir(), "handfuture-sitemap-"));
    const generatedPath = path.join(temporaryDirectory, "sitemap.xml");
    const generation = spawnSync("npm", ["run", "generate:sitemap"], {
      cwd: root,
      encoding: "utf8",
      env: { ...process.env, SITEMAP_OUTPUT: generatedPath },
    });

    try {
      expect(generation.status, generation.stderr || generation.stdout).toBe(0);
      expect(fs.readFileSync(generatedPath, "utf8")).toBe(read("public/sitemap.xml"));
    } finally {
      fs.rmSync(temporaryDirectory, { recursive: true, force: true });
    }

    const sitemap = read("public/sitemap.xml");
    const locations = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
    expect(locations).toEqual(
      SUPPORTED_LOCALES.flatMap((locale) =>
        PUBLIC_PATHS.map((route) => `${SITE_ORIGIN}${buildLocalizedPath(locale, route)}`),
      ),
    );
    expect(locations).toHaveLength(64);
    expect(new Set(locations).size).toBe(64);
    expect(locations.every((location) => !location.includes("?") && !location.includes("#"))).toBe(true);
    expect(sitemap.match(new RegExp(`<lastmod>${LAST_UPDATED}<\\/lastmod>`, "g"))).toHaveLength(64);
    expect(sitemap).not.toContain("/batch");
  });

  it("escapes dynamic XML text emitted by the sitemap renderer", () => {
    const moduleUrl = pathToFileURL(path.join(root, "scripts/generate-sitemap.mjs")).href;
    const probe = [
      `import { renderSitemap } from ${JSON.stringify(moduleUrl)};`,
      `process.stdout.write(renderSitemap([${JSON.stringify('https://example.test/a?x=1&label=<Palm "Guide">')}], ${JSON.stringify("2026-07-26&later")}));`,
    ].join("\n");
    const result = spawnSync(process.execPath, ["--input-type=module", "--eval", probe], {
      cwd: root,
      encoding: "utf8",
    });

    expect(result.status, result.stderr).toBe(0);
    expect(result.stdout).toContain(
      "<loc>https://example.test/a?x=1&amp;label=&lt;Palm &quot;Guide&quot;&gt;</loc>",
    );
    expect(result.stdout).toContain("<lastmod>2026-07-26&amp;later</lastmod>");
    expect(result.stdout).not.toContain("label=<Palm");
  });

  it("allows search and ad crawlers and advertises the sitemap", () => {
    const robots = read("public/robots.txt");
    expect(robots).toContain("User-agent: *\nAllow: /");
    expect(robots).toContain("User-agent: Mediapartners-Google\nAllow: /");
    expect(robots).toContain(`Sitemap: ${SITE_ORIGIN}/sitemap.xml`);
    expect(robots).not.toMatch(/Crawl-delay/i);
  });

  it("has one ownership script and no manual ad, fake rating, or editor runtime", () => {
    const html = read("index.html");
    expect(html.match(/pagead2\.googlesyndication\.com\/pagead\/js\/adsbygoogle\.js/g)).toHaveLength(1);
    expect(html).toContain(`client=${PUBLISHER_ID}`);
    expect(html).not.toMatch(/aggregateRating|YOUR_FACEBOOK_APP_ID|PalmReadingAI|static\.devv\.ai|90%/);
    expect(html).not.toContain("data-ad-slot");
  });

  it("redirects apex, rewrites each non-root public route, and applies safe headers", () => {
    const config = JSON.parse(read("vercel.json"));
    expect(config.redirects).toContainEqual({
      source: "/:path*",
      has: [{ type: "host", value: "handfortune.com" }],
      destination: "https://www.handfortune.com/:path*",
      permanent: true,
    });
    expect(config.rewrites).toEqual(PUBLIC_PATHS.filter((route) => route !== "/").map((source) => ({ source, destination: "/index.html" })));
    const allHeaders = config.headers.flatMap((entry: { headers: { key: string; value: string }[] }) => entry.headers);
    expect(allHeaders).toEqual(expect.arrayContaining([
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
      { key: "X-Frame-Options", value: "SAMEORIGIN" },
    ]));
    expect(fs.existsSync(path.join(root, "public/_headers"))).toBe(false);
  });
});
