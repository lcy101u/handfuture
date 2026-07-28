import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import createJiti from "jiti";

const projectRoot = fileURLToPath(new URL("../", import.meta.url));
const loadTypeScript = createJiti(import.meta.url);
const { PUBLIC_PATHS } = loadTypeScript("../src/config/public-routes.ts");
const { SUPPORTED_LOCALES } = loadTypeScript("../src/i18n/locales.ts");
const { prerenderRelativeFile, renderPrerenderedDocument } = loadTypeScript(
  "../src/server/prerender-html.ts",
);

export function generatePrerenderedPages({ templatePath, outputDirectory }) {
  const resolvedTemplate = path.resolve(templatePath);
  const resolvedOutput = path.resolve(outputDirectory);
  if (
    resolvedOutput === path.parse(resolvedOutput).root ||
    resolvedOutput === path.resolve(projectRoot)
  ) {
    throw new Error(`Refusing unsafe prerender output directory: ${resolvedOutput}`);
  }

  const template = fs.readFileSync(resolvedTemplate, "utf8");
  const documents = SUPPORTED_LOCALES.flatMap((locale) =>
    PUBLIC_PATHS.map((publicPath) => ({
      relativeFile: prerenderRelativeFile(locale, publicPath),
      html: renderPrerenderedDocument(template, locale, publicPath),
    })),
  );
  if (documents.length !== 64 || new Set(documents.map(({ relativeFile }) => relativeFile)).size !== 64) {
    throw new Error("Prerender matrix must contain exactly 64 unique files.");
  }

  fs.rmSync(resolvedOutput, { recursive: true, force: true });
  for (const { relativeFile, html } of documents) {
    const outputPath = path.join(resolvedOutput, relativeFile);
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, html, "utf8");
  }

  return documents.map(({ relativeFile }) => relativeFile);
}

const currentFile = fileURLToPath(import.meta.url);
const invokedFile = process.argv[1] ? path.resolve(process.argv[1]) : "";

if (currentFile === invokedFile) {
  const templatePath = process.env.PRERENDER_TEMPLATE
    ? path.resolve(process.env.PRERENDER_TEMPLATE)
    : path.join(projectRoot, "dist/index.html");
  const outputDirectory = process.env.PRERENDER_OUTPUT
    ? path.resolve(process.env.PRERENDER_OUTPUT)
    : path.join(projectRoot, "dist/_prerender");
  const files = generatePrerenderedPages({ templatePath, outputDirectory });
  process.stdout.write(`Generated ${files.length} localized HTML documents.\n`);
}
