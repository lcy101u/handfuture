// @vitest-environment node
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath, pathToFileURL } from "node:url";
import { describe, expect, it } from "vitest";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");

describe("localized not-found function", () => {
  it("returns a private localized HTML response with a real 404 status", () => {
    const modulePath = pathToFileURL(
      path.join(root, "api/localized-not-found.ts"),
    ).href;
    const probe = [
      `import createJiti from "jiti";`,
      `const jiti = createJiti(import.meta.url);`,
      `const handler = jiti(${JSON.stringify(modulePath)}).default;`,
      `const responses = [];`,
      `for (const locale of ["fr", "ja"]) {`,
      `  const result = { locale, headers: {}, statusCode: null, body: null };`,
      `  const response = {`,
      `    setHeader(name, value) { result.headers[name] = value; },`,
      `    status(code) { result.statusCode = code; return this; },`,
      `    send(body) { result.body = body; },`,
      `  };`,
      `  handler({ query: { locale } }, response);`,
      `  responses.push(result);`,
      `}`,
      `process.stdout.write(JSON.stringify(responses));`,
    ].join("\n");
    const execution = spawnSync(
      process.execPath,
      ["--input-type=module", "--eval", probe],
      { cwd: root, encoding: "utf8" },
    );

    expect(execution.status, execution.stderr).toBe(0);
    const [french, japanese] = JSON.parse(execution.stdout) as Array<{
      locale: string;
      headers: Record<string, string>;
      statusCode: number;
      body: string;
    }>;
    expect(french).toMatchObject({
      locale: "fr",
      statusCode: 404,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "private, no-store",
      },
    });
    expect(french.body).toContain('<html lang="fr">');
    expect(french.body).toContain("Page introuvable | HandFuture");
    expect(french.body).toContain("Page introuvable.");
    expect(french.body).toContain('<meta name="robots" content="noindex, follow" />');
    expect(japanese.statusCode).toBe(404);
    expect(japanese.body).toContain('<html lang="ja">');
    expect(japanese.body).toContain("ページが見つかりません｜HandFuture");
    expect(japanese.body).toContain("ページが見つかりません。");
    expect(japanese.body).not.toContain('rel="canonical"');
  });
});
