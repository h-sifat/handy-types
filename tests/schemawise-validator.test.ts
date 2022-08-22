import parseSchema from "../src/schema-parser";
import validate from "../src/schemawise-validator";

describe("Validation", () => {
  it.concurrent.each([
    {
      schema: "string",
      value: "a string",
      expectedResult: true,
    },
    {
      schema: "string[]",
      value: ["a string array"],
      expectedResult: true,
    },
    {
      schema: "string | string[]",
      value: ["a string array"],
      expectedResult: true,
    },
    {
      schema: "string | string[]",
      value: "a string",
      expectedResult: true,
    },
  ])(
    `validate({schema: schemaParser("$schema"), value: $value}) === $expectedResult`,
    ({ schema, value, expectedResult }) => {
      const parsedSchema = parseSchema(schema);
      expect(validate({ schema: parsedSchema, value })).toBe(expectedResult);
    }
  );

  it("throws error if schema type is invalid", () => {
    expect.assertions(1);
    try {
      // @ts-ignore
      validate({ schema: { schemaType: "unknown_schema_type" }, value: "hi" });
    } catch (ex: any) {
      expect(ex.code).toBe("INTERNAL_ERROR_INVALID_SCHEMA");
    }
  });
});
