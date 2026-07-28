import {
  localeFromBrowserLanguages,
  localeFromCountry,
  type Locale,
} from "./locales";

const DEFAULT_COUNTRY_TIMEOUT_MS = 400;

interface InitialLocaleOptions {
  explicitLocale: Locale | null;
  browserLanguages: readonly string[];
  fetchCountry: () => Promise<string | null>;
  timeoutMs?: number;
}

function validCountry(value: string | null): value is string {
  return typeof value === "string" && /^[A-Za-z]{2}$/.test(value);
}

export async function fetchCountryCode(
  fetchImpl: typeof fetch = fetch,
): Promise<string | null> {
  try {
    const response = await fetchImpl("/api/locale", {
      cache: "no-store",
      credentials: "same-origin",
      headers: { Accept: "application/json" },
    });
    if (!response.ok) return null;

    const body: unknown = await response.json();
    if (
      body === null ||
      typeof body !== "object" ||
      Object.keys(body).length !== 1 ||
      !("country" in body)
    ) {
      return null;
    }

    const country = body.country;
    return country === null ||
      (typeof country === "string" && /^[A-Z]{2}$/.test(country))
      ? country
      : null;
  } catch {
    return null;
  }
}

export async function resolveInitialLocale({
  explicitLocale,
  browserLanguages,
  fetchCountry,
  timeoutMs = DEFAULT_COUNTRY_TIMEOUT_MS,
}: InitialLocaleOptions): Promise<Locale> {
  if (explicitLocale) return explicitLocale;

  const browserLocale = localeFromBrowserLanguages(browserLanguages);
  if (browserLocale) return browserLocale;

  let timeout: ReturnType<typeof setTimeout> | undefined;

  try {
    const country = await Promise.race([
      fetchCountry(),
      new Promise<null>((resolve) => {
        timeout = setTimeout(() => resolve(null), timeoutMs);
      }),
    ]);

    return validCountry(country) ? localeFromCountry(country) : "en";
  } catch {
    return "en";
  } finally {
    if (timeout) clearTimeout(timeout);
  }
}
