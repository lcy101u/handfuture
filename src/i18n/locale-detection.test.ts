import { afterEach, describe, expect, it, vi } from "vitest";
import {
  fetchCountryCode,
  resolveInitialLocale,
} from "./locale-detection";

describe("resolveInitialLocale", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("uses a saved explicit preference before browser language and country", async () => {
    let countryRequests = 0;

    await expect(
      resolveInitialLocale({
        explicitLocale: "fr",
        browserLanguages: ["ja-JP"],
        fetchCountry: async () => {
          countryRequests += 1;
          return "KR";
        },
      }),
    ).resolves.toBe("fr");
    expect(countryRequests).toBe(0);
  });

  it("uses the first supported browser language before country", async () => {
    let countryRequests = 0;

    await expect(
      resolveInitialLocale({
        explicitLocale: null,
        browserLanguages: ["de-DE", "ja-JP"],
        fetchCountry: async () => {
          countryRequests += 1;
          return "KR";
        },
      }),
    ).resolves.toBe("ja");
    expect(countryRequests).toBe(0);
  });

  it("uses country only when no browser language is supported", async () => {
    await expect(
      resolveInitialLocale({
        explicitLocale: null,
        browserLanguages: ["de-DE"],
        fetchCountry: async () => "BR",
      }),
    ).resolves.toBe("pt-BR");
  });

  it.each([
    ["request failure", async () => Promise.reject(new Error("offline"))],
    ["malformed country", async () => "BRA"],
  ])("falls back to English after %s", async (_label, fetchCountry) => {
    await expect(
      resolveInitialLocale({
        explicitLocale: null,
        browserLanguages: ["de-DE"],
        fetchCountry,
      }),
    ).resolves.toBe("en");
  });

  it("falls back to English after the country timeout", async () => {
    vi.useFakeTimers();
    const resolution = resolveInitialLocale({
      explicitLocale: null,
      browserLanguages: ["de-DE"],
      fetchCountry: () => new Promise<string>(() => undefined),
      timeoutMs: 40,
    });

    await vi.advanceTimersByTimeAsync(40);

    await expect(resolution).resolves.toBe("en");
  });
});

describe("fetchCountryCode", () => {
  it("reads the validated country from the private same-origin endpoint", async () => {
    const requests: Array<{ input: RequestInfo | URL; init?: RequestInit }> = [];
    const fetchImpl: typeof fetch = async (input, init) => {
      requests.push({ input, init });
      return new Response(JSON.stringify({ country: "KR" }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    };

    await expect(fetchCountryCode(fetchImpl)).resolves.toBe("KR");
    expect(requests).toEqual([
      {
        input: "/api/locale",
        init: {
          cache: "no-store",
          credentials: "same-origin",
          headers: { Accept: "application/json" },
        },
      },
    ]);
  });

  it.each([
    ["unexpected shape", { country: "KOR" }],
    ["extra response data", { country: "KR", city: "Seoul" }],
    ["missing country", {}],
  ])("rejects %s", async (_label, body) => {
    const fetchImpl: typeof fetch = async () =>
      new Response(JSON.stringify(body), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });

    await expect(fetchCountryCode(fetchImpl)).resolves.toBeNull();
  });

  it("returns null for an endpoint error", async () => {
    const fetchImpl: typeof fetch = async () =>
      new Response("Unavailable", { status: 503 });

    await expect(fetchCountryCode(fetchImpl)).resolves.toBeNull();
  });
});
