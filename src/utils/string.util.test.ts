import { describe, test, expect } from "@jest/globals";
import { addQueryParamToUrl } from "./string.util";

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
