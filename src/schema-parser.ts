import { handyTypes, AllHandyTypes, typeNames } from "./types";
import { EPP, assertValidHandyType } from "./util";

interface BasicSchemaDefinition {
  schemaType: "basic";
  type: AllHandyTypes;
  schemaName: string;
}

interface ArraySchemaDefinition {
  schemaType: "array";
  elementType: AllHandyTypes;
  schemaName: string;
}

type UnionSubSchema = BasicSchemaDefinition | ArraySchemaDefinition;

interface UnionSchemaDefinition {
  schemaType: "union";
  subSchemas: UnionSubSchema[];
  schemaName: string;
}

export type SchemaDefinition = UnionSubSchema | UnionSchemaDefinition;

export default function parseSchema(schema: string): SchemaDefinition {
  if (!handyTypes.non_empty_string(schema))
    throw new EPP(`Invalid schema: ${schema}`, "INVALID_SCHEMA");

  schema = schema.trim();

  if (schema.includes("|")) {
    const subSchemas = schema
      .split("|")
      .map((subSchema) => subSchema.trim())
      .map(parseSchema) as UnionSubSchema[];

    const schemaName = subSchemas
      .map((subSchema) => subSchema.schemaName)
      .join(" or ");

    return { schemaType: "union", subSchemas, schemaName };
  }

  if (schema.endsWith("[]")) {
    const elementType = schema.slice(0, -2) as AllHandyTypes; // remove "[]"
    assertValidHandyType(elementType);

    return {
      elementType,
      schemaType: "array",
      schemaName: `Array of ${typeNames[elementType]}`,
    };
  }

  if (schema in handyTypes)
    return {
      schemaType: "basic",
      type: schema as AllHandyTypes,
      schemaName: typeNames[schema as AllHandyTypes],
    };

  throw new EPP(`Invalid handy type: "${schema}".`, "INVALID_SCHEMA");
}
