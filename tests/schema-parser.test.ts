import parseSchema from "../src/schema-parser";

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
    expect(parseSchema(schema)).toEqual(parsedSchema);
  });
});

describe("schemaValidation", () => {
  it.each([{ schema: "duck", errorCode: "INVALID_HANDY_TYPE" }])(
    `throws error with code: "$errorCode" for schema: "$schema"`,
    ({ schema, errorCode }) => {
      expect.assertions(1);

      try {
        parseSchema(schema);
      } catch (ex: any) {
        expect(ex.code).toBe(errorCode);
      }
    }
  );
});
