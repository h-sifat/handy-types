import { handyTypes, HandyTypes_Interface } from "./index";

type AllHandyTypes = keyof HandyTypes_Interface;

export default function is<Type>(schema: string, value: any): value is Type {
  if (schema.includes("|")) {
    const unionSchemaElements = schema
      .split("|")
      .map((unionSchema) => unionSchema.trim());

    for (let index = 0; index < unionSchemaElements.length; index++) {
      const _schema = unionSchemaElements[index];

      try {
        if (is(_schema, value)) return true;
      } catch (ex: any) {
        if ((ex.code = "INVALID_HANDY_TYPE")) {
          const error = new Error(
            `Invalid schema ("${_schema}") at position ${
              index + 1
            } in union schema "${schema}".`
          );
          // @ts-ignore
          error.code = "INVALID_UNION_SCHEMA";
          throw error;
        }

        throw ex;
      }
    }
    return false;
  }

  if (schema.endsWith("[]")) {
    const type = schema.slice(0, -2); // remove "[]"

    assertValidHandyType(type);
    return validateArray({ array: value, elementType: type });
  }

  assertValidHandyType(schema);

  return handyTypes[schema](value);
}

function assertValidHandyType(type: string): asserts type is AllHandyTypes {
  if (!(type in handyTypes)) {
    const error = new Error(`Invalid handy type: "${type}"`);
    // @ts-ignore
    error.code = "INVALID_HANDY_TYPE";
    throw error;
  }
}

type ValidateArray_Argument = {
  array: unknown;
  elementType: AllHandyTypes;
};
function validateArray(arg: ValidateArray_Argument): boolean {
  const { array, elementType } = arg;
  if (!handyTypes.array(array)) return false;

  const isAnyElementInvalid = array.some(
    (element) => !handyTypes[elementType](element)
  );

  return !isAnyElementInvalid;
}
