// @vitest-environment node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { ADS_TXT_RECORD, PUBLISHER_ID, SITE_ORIGIN } from "@/config/site-metadata";
import { PUBLIC_PATHS } from "@/config/public-routes";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const read = (file: string) => fs.readFileSync(path.join(root, file), "utf8");

describe("publisher and crawl files", () => {
  it("has the exact AdSense record and final newline", () => {
    expect(read("public/ads.txt")).toBe(`${ADS_TXT_RECORD}\n`);
  });

  it("lists exactly the public canonical URLs", () => {
    const sitemap = read("public/sitemap.xml");
    const locations = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
    expect(locations).toEqual(PUBLIC_PATHS.map((route) => `${SITE_ORIGIN}${route === "/" ? "/" : route}`));
    expect(sitemap).not.toContain("/batch");
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
