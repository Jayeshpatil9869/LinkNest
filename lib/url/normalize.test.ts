import { describe, expect, it } from "vitest";
import { extractDomain, normalizeUrl } from "@/lib/url/normalize";

describe("normalizeUrl", () => {
  it("lowercases host and strips tracking params", () => {
    expect(
      normalizeUrl("HTTPS://Example.com/Path/?utm_source=x&fbclid=1"),
    ).toBe("https://example.com/Path");
  });

  it("keeps root slash and strips hash", () => {
    expect(normalizeUrl("https://example.com/#section")).toBe(
      "https://example.com/",
    );
  });
});

describe("extractDomain", () => {
  it("removes www", () => {
    expect(extractDomain("https://www.example.com/a")).toBe("example.com");
  });
});
