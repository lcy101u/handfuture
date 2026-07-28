interface LocaleRequest {
  headers: Record<string, string | string[] | undefined>;
}

interface LocaleResponse {
  setHeader(name: string, value: string): void;
  status(code: number): LocaleResponse;
  json(body: { country: string | null }): void;
}

function countryFromHeader(value: string | string[] | undefined): string | null {
  return typeof value === "string" && /^[A-Za-z]{2}$/.test(value)
    ? value.toUpperCase()
    : null;
}

export default function localeHandler(
  request: LocaleRequest,
  response: LocaleResponse,
): void {
  response.setHeader("Cache-Control", "private, no-store");
  response.status(200).json({
    country: countryFromHeader(request.headers["x-vercel-ip-country"]),
  });
}
