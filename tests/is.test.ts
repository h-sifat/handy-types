import is from "../src/is";

describe("Validation", () => {
  it.concurrent.each([
    {
      type: "string",
      value: 23,
      result: false,
    },
    {
      type: "string ", // with a whitespace at the end
      value: 23,
      result: false,
    },
    {
      type: "string",
      value: "a string",
      result: true,
    },
    {
      type: "  string[]   ",
      value: "not a string array",
      result: false,
    },
    {
      type: "string[]",
      value: ["a", "b"],
      result: true,
    },
    {
      type: "string | number",
      value: "a_string",
      result: true,
    },
    {
      type: "string | number",
      value: 231,
      result: true,
    },
    {
      type: "string | number[]",
      value: [231, 2],
      result: true,
    },
  ])(`is("$type", $value) === $result`, ({ type, value, result }) => {
    expect(is(type, value)).toBe(result);
  });
});

describe("Error Handling", () => {
  it.concurrent.each([
    23,
    { val: "non a string" },
    "not_valid_handy_type",
    "not_valid_handy_type[]",
    "not_valid_handy_type[] | integer",
  ])("throws error if schema (%p) is invalid", (schema) => {
    expect.assertions(1);
    try {
      // @ts-ignore
      is(schema, "value");
    } catch (ex: any) {
      expect(ex.code).toBe("INVALID_SCHEMA");
    }
  });
});
