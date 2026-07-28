// @vitest-environment node

import { describe, expect, it } from "vitest";
import localeHandler from "../../api/locale";

interface RecordedResponse {
  statusCode: number;
  headers: Record<string, string>;
  body: unknown;
  setHeader(name: string, value: string): void;
  status(code: number): RecordedResponse;
  json(body: unknown): void;
}

function responseRecorder(): RecordedResponse {
  return {
    statusCode: 0,
    headers: {},
    body: undefined,
    setHeader(name, value) {
      this.headers[name.toLowerCase()] = value;
    },
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(body) {
      this.body = body;
    },
  };
}

function invoke(country: string | string[] | undefined) {
  const response = responseRecorder();
  localeHandler(
    { headers: { "x-vercel-ip-country": country } },
    response,
  );
  return response;
}

describe("GET /api/locale", () => {
  it("returns an uppercase two-letter country and disables caching", () => {
    const response = invoke("tw");

    expect(response.statusCode).toBe(200);
    expect(response.headers).toEqual({
      "cache-control": "private, no-store",
    });
    expect(response.body).toEqual({ country: "TW" });
  });

  it.each([
    undefined,
    "",
    " T W ",
    "USA",
    "T1",
    "ÉU",
    "TW,US",
    ["TW"],
  ])("returns only a null country for invalid header %j", (country) => {
    const response = invoke(country);

    expect(response.statusCode).toBe(200);
    expect(response.headers["cache-control"]).toBe("private, no-store");
    expect(response.body).toEqual({ country: null });
  });
});
