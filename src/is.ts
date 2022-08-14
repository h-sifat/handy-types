import { handyTypes, AllHandyTypes } from "./types";
import { EPP, assertValidHandyType } from "./util";

export default function is<Type>(schema: string, value: any): value is Type {
  // if the schema is already a handy-type then we don't have to check
  // whether it's a union or array schema.
  if (schema in handyTypes)
    return validateBasicType({ type: schema as AllHandyTypes, value });

  // it's a union schema
  if (schema.includes("|")) {
    const subSchemas = schema.split("|").map((subSchema) => subSchema.trim());

    return validateUnionType({ subSchemas, value });
  }

  // it's an array schema
  if (schema.endsWith("[]")) {
    const elementType = schema.slice(0, -2); // remove "[]"
    assertValidHandyType(elementType);

    return validateArrayType({
      array: value,
      elementType: elementType as AllHandyTypes,
    });
  }

  throw new EPP(`Invalid handy-type: "${schema}".`, "INVALID_HANDY_TYPE");
}

// -------------- validateBasicType ---------------------------------
interface ValidateBasicTypeArgument {
  type: AllHandyTypes;
  value: unknown;
}

export function validateBasicType(arg: ValidateBasicTypeArgument): boolean {
  const { type, value } = arg;
  return handyTypes[type](value);
}

// -------------- validateUnionType ---------------------------------
interface validateUnionTypeArgument {
  subSchemas: string[];
  value: unknown;
}

function validateUnionType(arg: validateUnionTypeArgument): boolean {
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
// -------------- validateArrayType ---------------------------------
type ValidateArrayTypeArgument = {
  array: unknown;
  elementType: AllHandyTypes;
};

export function validateArrayType(arg: ValidateArrayTypeArgument): boolean {
  const { array, elementType } = arg;

  if (!handyTypes.array(array)) return false;

  const isAnyElementInvalid = array.some(
    (element) => !handyTypes[elementType](element)
  );

  return !isAnyElementInvalid;
}
