import parseSchema from "../src/schema-parser";
import { typeNames } from "../src/types";

describe("input/output", () => {
  it.concurrent.each([
    {
      schema: "number",
      parsedSchema: {
        schemaType: "basic",
        type: "number",
        schemaName: typeNames["number"],
      },
    },
    {
      schema: "string[]",
      parsedSchema: {
        schemaType: "array",
        elementType: "string",
        schemaName: "Array of String",
      },
    },
    {
      schema: "string[] | number",
      parsedSchema: {
        schemaType: "union",
        schemaName: `Array of String or ${typeNames["number"]}`,
        subSchemas: [
          {
            schemaType: "array",
            elementType: "string",
            schemaName: `Array of ${typeNames["string"]}`,
          },
          {
            type: "number",
            schemaType: "basic",
            schemaName: typeNames["number"],
          },
        ],
      },
    },
  ])(`schemaParser("$schema") = $parsedSchema`, ({ schema, parsedSchema }) => {
    expect(parseSchema(schema)).toEqual(parsedSchema);
  });
});

describe("schemaValidation", () => {
  it.concurrent.each([{ schema: "duck", errorCode: "INVALID_HANDY_TYPE" }])(
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
