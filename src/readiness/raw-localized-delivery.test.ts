// @vitest-environment node
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath, pathToFileURL } from "node:url";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { PUBLIC_PATHS, type PublicPath } from "@/config/public-routes";
import { SUPPORTED_LOCALES, type Locale } from "@/i18n/locales";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const templatePath = path.join(root, "dist/index.html");
let outputDirectory = "";
let generation: ReturnType<typeof spawnSync>;

function relativeOutputPath(locale: Locale, publicPath: PublicPath): string {
  return publicPath === "/"
    ? path.join(locale, "index.html")
    : `${locale}${publicPath}.html`;
}

function readOutput(locale: Locale, publicPath: PublicPath): string {
  return fs.readFileSync(
    path.join(outputDirectory, relativeOutputPath(locale, publicPath)),
    "utf8",
  );
}

beforeAll(() => {
  outputDirectory = fs.mkdtempSync(
    path.join(os.tmpdir(), "handfuture-prerender-test-"),
  );
  generation = spawnSync(process.execPath, ["scripts/prerender.mjs"], {
    cwd: root,
    encoding: "utf8",
    env: {
      ...process.env,
      PRERENDER_TEMPLATE: templatePath,
      PRERENDER_OUTPUT: outputDirectory,
    },
  });
});

afterAll(() => {
  if (outputDirectory) {
    fs.rmSync(outputDirectory, { recursive: true, force: true });
  }
});

describe("raw localized delivery", () => {
  it("generates exactly one meaningful HTML document for every canonical route", () => {
    expect(generation.status, String(generation.stderr || generation.stdout)).toBe(0);

    const files = fs
      .readdirSync(outputDirectory, { recursive: true, withFileTypes: true })
      .filter((entry) => entry.isFile())
      .map((entry) => path.relative(outputDirectory, path.join(entry.parentPath, entry.name)))
      .sort();
    const expectedFiles = SUPPORTED_LOCALES.flatMap((locale) =>
      PUBLIC_PATHS.map((publicPath) => relativeOutputPath(locale, publicPath)),
    ).sort();

    expect(files).toEqual(expectedFiles);
    expect(files).toHaveLength(64);
    for (const relativePath of files) {
      const html = fs.readFileSync(path.join(outputDirectory, relativePath), "utf8");
      expect(html, relativePath).toContain('<main id="prerendered-content"');
      expect(html, relativePath).not.toContain('<div id="root"></div>');
      expect(html, relativePath).toMatch(
        /<script type="module" crossorigin src="\/assets\/[^"<]+\.js"><\/script>/,
      );
      expect(html, relativePath).not.toMatch(/[ \t]+$/m);
    }
  });

  it.each([
    {
      locale: "zh-CN",
      publicPath: "/",
      title: "HandFuture｜手相文化探索与手部检测体验",
      description:
        "从文化角度认识手相传统，使用浏览器内的手部检测获得一张非科学、仅供娱乐与自我反思的提示卡；照片不会上传到 HandFuture 服务器。",
      bodyFragments: ["从一张手部照片，开始一段文化探索", "常见问题"],
    },
    {
      locale: "ja",
      publicPath: "/guides/science-and-limitations",
      title: "手相、科学、そして限界｜HandFuture",
      description:
        "手の関節検出と手相解釈の違い、バーナム効果が印象に与える影響、手相を医療・金融・人生の判断に使ってはいけない理由を解説します。",
      bodyFragments: ["手相、科学、そして限界", "検出は解釈ではない"],
    },
    {
      locale: "fr",
      publicPath: "/privacy",
      title: "Politique de confidentialité | HandFuture",
      description:
        "Découvrez comment HandFuture traite les photos dans le navigateur, utilise le stockage local et Vercel Analytics, et comment fonctionnent la publicité Google et les choix de consentement.",
      bodyFragments: ["Politique de confidentialité", "Champ d’application et date"],
    },
    {
      locale: "pt-BR",
      publicPath: "/terms",
      title: "Termos de Uso | HandFuture",
      description:
        "Leia o escopo de entretenimento, a orientação etária, as condutas proibidas, a propriedade intelectual, a disponibilidade e os limites do HandFuture, incluindo a ausência de orientação profissional.",
      bodyFragments: ["Termos de Uso", "Aceitação e descrição do serviço"],
    },
  ] as const)(
    "emits localized raw head and body for $locale$publicPath",
    ({ locale, publicPath, title, description, bodyFragments }) => {
      const html = readOutput(locale, publicPath);
      const canonicalPath = publicPath === "/" ? `/${locale}/` : `/${locale}${publicPath}`;

      expect(html).toContain(`<html lang="${locale}">`);
      expect(html).toContain(`<title>${title}</title>`);
      expect(html).toContain(`<meta name="description" content="${description}" />`);
      expect(html).toContain(
        `<link rel="canonical" href="https://www.handfortune.com${canonicalPath}" />`,
      );
      expect(html).toContain(
        '<link rel="alternate" hreflang="x-default" href="https://www.handfortune.com/" />',
      );
      expect(html.match(/<link rel="alternate" hreflang=/g)).toHaveLength(9);
      expect(html).toContain(`<meta property="og:title" content="${title}" />`);
      expect(html).toContain(`<meta name="twitter:title" content="${title}" />`);
      expect(html).toContain(`"inLanguage":"${locale}"`);
      expect(html).toContain(`"url":"https://www.handfortune.com${canonicalPath}"`);
      for (const fragment of bodyFragments) expect(html).toContain(fragment);
    },
  );

  it("escapes HTML, attributes, and script-breaking JSON payloads", () => {
    const modulePath = pathToFileURL(
      path.join(root, "src/server/localized-html.ts"),
    ).href;
    const probe = [
      `import createJiti from "jiti";`,
      `const jiti = createJiti(import.meta.url);`,
      `const renderer = jiti(${JSON.stringify(modulePath)});`,
      `process.stdout.write(JSON.stringify({`,
      `html: renderer.escapeHtml(${JSON.stringify('<img src=x onerror="boom"> &')}),`,
      `attribute: renderer.escapeAttribute(${JSON.stringify('" autofocus onfocus="boom')}),`,
      `json: renderer.serializeJsonForHtml({ value: ${JSON.stringify('</script><script>boom</script>&')} }),`,
      `}));`,
    ].join("\n");
    const result = spawnSync(process.execPath, ["--input-type=module", "--eval", probe], {
      cwd: root,
      encoding: "utf8",
    });

    expect(result.status, result.stderr).toBe(0);
    expect(JSON.parse(result.stdout)).toEqual({
      html: "&lt;img src=x onerror=&quot;boom&quot;&gt; &amp;",
      attribute: "&quot; autofocus onfocus=&quot;boom",
      json: '{"value":"\\u003c/script\\u003e\\u003cscript\\u003eboom\\u003c/script\\u003e\\u0026"}',
    });
  });
});
