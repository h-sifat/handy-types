import is from "../src/is";

describe("Validation", () => {
  it.concurrent.each([
    {
      type: "string",
      value: 23,
      result: false,
    },
    {
      type: "string",
      value: "a string",
      result: true,
    },
    {
      type: "string[]",
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
  it("throws error if type is invalid", () => {
    expect.assertions(1);
    try {
      is("not_valid_handy_type", "value");
    } catch (ex: any) {
      expect(ex.code).toBe("INVALID_HANDY_TYPE");
    }
  });

  it("throws error if array element type is invalid", () => {
    expect.assertions(1);
    try {
      is("not_valid_handy_type[]", "value");
    } catch (ex: any) {
      expect(ex.code).toBe("INVALID_HANDY_TYPE");
    }
  });

  it("throws error if any element of union schema is invlaid", () => {
    expect.assertions(1);
    try {
      is("not_valid_handy_type[] | integer", "value");
    } catch (ex: any) {
      expect(ex.code).toBe("INVALID_UNION_SCHEMA");
    }
  });
});
