import { is, assert, cache } from "../src";

beforeEach(() => {
  cache.clear();
});

describe("is", () => {
  it("validates the input", () => {
    expect(is("integer | integer[]", 23)).toBeTruthy();
    expect(is.cache("integer | integer[]", 23)).toBeTruthy();
    expect(is("integer | integer[]", ["not_a_integer"])).toBeFalsy();
    expect(is.cache("integer | integer[]", ["not_a_integer"])).toBeFalsy();
  });

  it("uses caching", () => {
    expect(cache.size).toBe(0);

    const schema = "integer | integer[]";
    expect(is.cache(schema, [23])).toBeTruthy();

    expect(cache.size).toBe(1);

    // remove cache
    cache.delete(schema);
    expect(cache.size).toBe(0);
  });
});

describe("assert", () => {
  it("validates the input", () => {
    expect(() => {
      assert("integer | integer[]", [23]);
    }).not.toThrow(Error);

    expect(() => {
      assert.cache("integer | integer[]", [23]);
    }).not.toThrow(Error);

    expect(() => {
      assert("integer | integer[]", "a string");
    }).toThrow(/Integer/);

    expect(() => {
      assert.cache("integer | integer[]", "a string");
    }).toThrow(/Integer/);
  });

  it("uses caching", () => {
    expect(cache.size).toBe(0);

    const schema = "integer | integer[]";
    expect(() => {
      assert.cache(schema, [23]);
    }).not.toThrow();

    expect(cache.size).toBe(1);
    expect(cache.has(schema)).toBeTruthy();

    // remove cache
    cache.clear();
    expect(cache.size).toBe(0);
  });
});
