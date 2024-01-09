import { describe, test, expect } from "@jest/globals";
import { addQueryParamToUrl, getAbsoluteUrl } from "./string.util";

describe("addQueryParamToUrl", () => {
  test("empty param object", () => {
    const result = addQueryParamToUrl("http://localhost:3000", {});
    expect(result).toBe("http://localhost:3000");
  });

  test("non-empty param object", () => {
    const result = addQueryParamToUrl("http://localhost:3000", { q: "test", "page-limit": 100 });
    expect(result).toBe("http://localhost:3000?q=test&page-limit=100");
  });

  test("url already has some query param", () => {
    const result = addQueryParamToUrl("http://localhost:3000?existing=existing", { q: "test", "page-limit": 100 });
    expect(result).toBe("http://localhost:3000?existing=existing&q=test&page-limit=100");
  });
});

describe("getAbsoluteUrl", () => {
  test("empty relative url", () => {
    const result = getAbsoluteUrl("", "http://localhost:3000");
    expect(result).toBe("http://localhost:3000");
  });
  test("/ as relative url", () => {
    const result = getAbsoluteUrl("", "http://localhost:3000");
    expect(result).toBe("http://localhost:3000");
  });
  test("one level deep", () => {
    const result = getAbsoluteUrl("/test", "http://localhost:3000");
    expect(result).toBe("http://localhost:3000/test");
  });
  test("morethan one level deep", () => {
    const result = getAbsoluteUrl("/test/one/two/", "http://localhost:3000");
    expect(result).toBe("http://localhost:3000/test/one/two");
  });
  test("no / in relative url", () => {
    const result = getAbsoluteUrl("test", "http://localhost:3000");
    expect(result).toBe("http://localhost:3000/test");
  });
});
