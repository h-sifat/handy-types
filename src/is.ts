import { handyTypes, AllHandyTypes } from "./index";
import { EPP } from "./util";

export default function is<Type>(schema: string, value: any): value is Type {
  // if the schema is already a handy-type then we don't have to check
  // whether it's a union or array schema.
  if (schema in handyTypes) return handyTypes[schema as AllHandyTypes](value);

  // it's a union schema
  if (schema.includes("|")) {
    const subSchemas = schema.split("|").map((subSchema) => subSchema.trim());

    return validateUnion({ subSchemas, value });
  }

  // it's an array schema
  if (schema.endsWith("[]")) {
    const type = schema.slice(0, -2); // remove "[]"

    return validateArray({ array: value, elementType: type as AllHandyTypes });
  }

  throw new EPP(`Invalid handy-type: "${schema}".`, "INVALID_HANDY_TYPE");
}

export function assertValidHandyType(
  type: string
): asserts type is AllHandyTypes {
  if (!(type in handyTypes))
    throw new EPP(`Invalid handy type: "${type}"`, "INVALID_HANDY_TYPE");
}

// -------------- validateUnion ---------------------------------
interface validateUnionArgument {
  subSchemas: string[];
  value: unknown;
}

function validateUnion(arg: validateUnionArgument): boolean {
  const { subSchemas, value } = arg;

  for (let index = 0; index < subSchemas.length; index++) {
    const subSchema = subSchemas[index];

    try {
      if (is(subSchema, value)) return true;
    } catch (ex: any) {
      const message = `Invalid sub schema ("${subSchema}") at position ${
        index + 1
      } in union schema "${subSchema}".`;

      throw new EPP(message, "INVALID_UNION_SCHEMA");
    }
  }

  return false;
}
// -------------- validateArray ---------------------------------
type ValidateArrayArgument = {
  array: unknown;
  elementType: AllHandyTypes;
};

function validateArray(arg: ValidateArrayArgument): boolean {
  const { array, elementType } = arg;

  assertValidHandyType(elementType);

  if (!handyTypes.array(array)) return false;

  const isAnyElementInvalid = array.some(
    (element) => !handyTypes[elementType](element)
  );

  return !isAnyElementInvalid;
}
