import { validateArrayType, validateBasicType } from "./is";
import { SchemaDefinition } from "./schema-parser";
import { EPP } from "./util";

interface ValidateArgument {
  schema: SchemaDefinition;
  value: unknown;
}

export default function validate(arg: ValidateArgument): boolean {
  const { schema, value } = arg;

  switch (schema.schemaType) {
    case "basic":
      return validateBasicType({ type: schema.type, value });
    case "array":
      return validateArrayType({
        elementType: schema.elementType,
        array: value,
      });
    case "union":
      return schema.subSchemas.some((subSchema) =>
        validate({ schema: subSchema, value })
      );
    default:
      throw new EPP(
        // @ts-ignore
        `Invalid schema type: "${schema.schemaType}"`,
        "INTERNAL_ERROR_INVALID_SCHEMA"
      );
  }
}
