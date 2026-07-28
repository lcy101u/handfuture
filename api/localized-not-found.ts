import { SUPPORTED_LOCALES, type Locale } from "../src/i18n/locales";
import { renderLocalizedNotFoundDocument } from "../src/server/localized-html";

interface LocalizedNotFoundRequest {
  query: Record<string, string | string[] | undefined>;
}

interface LocalizedNotFoundResponse {
  setHeader(name: string, value: string): void;
  status(code: number): LocalizedNotFoundResponse;
  send(body: string): void;
}

function requestedLocale(value: string | string[] | undefined): Locale {
  const candidate = Array.isArray(value) ? value[0] : value;
  return candidate && (SUPPORTED_LOCALES as readonly string[]).includes(candidate)
    ? (candidate as Locale)
    : "en";
}

export default function localizedNotFoundHandler(
  request: LocalizedNotFoundRequest,
  response: LocalizedNotFoundResponse,
): void {
  const locale = requestedLocale(request.query.locale);
  response.setHeader("Content-Type", "text/html; charset=utf-8");
  response.setHeader("Cache-Control", "private, no-store");
  response.status(404).send(renderLocalizedNotFoundDocument(locale));
}
