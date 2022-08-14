import parseSchema from "../src/schema-parser";
import validate from "../src/schemawise-validator";

describe("Validation", () => {
  it.each([
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
});
