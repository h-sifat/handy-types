import schemaParser from "../src/schema-parser";

describe("input/output", () => {
  it.each([
    {
      schema: "number",
      parsedSchema: { schemaType: "basic", type: "number" },
    },
    {
      schema: "string[]",
      parsedSchema: { schemaType: "array", elementType: "string" },
    },
    {
      schema: "string[] | number",
      parsedSchema: {
        schemaType: "union",
        subSchemas: [
          { schemaType: "array", elementType: "string" },
          { schemaType: "basic", type: "number" },
        ],
      },
    },
  ])(`schemaParser("$schema") = $parsedSchema`, ({ schema, parsedSchema }) => {
    expect(schemaParser(schema)).toEqual(parsedSchema);
  });
});

describe("schemaValidation", () => {
  it.each([{ schema: "duck", errorCode: "INVALID_HANDY_TYPE" }])(
    `throws error with code: "$errorCode" for schema: "$schema"`,
    ({ schema, errorCode }) => {
      expect.assertions(1);

      try {
        schemaParser(schema);
      } catch (ex: any) {
        expect(ex.code).toBe(errorCode);
      }
    }
  );
});
