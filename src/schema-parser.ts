import { handyTypes, AllHandyTypes } from ".";
import { assertValidHandyType } from "./is";
import { EPP } from "./util";

interface BasicSchemaDefinition {
  schemaType: "basic";
  type: AllHandyTypes;
}

interface ArraySchemaDefinition {
  schemaType: "array";
  elementType: AllHandyTypes;
}

type UnionSubSchema = BasicSchemaDefinition | ArraySchemaDefinition;

interface UnionSchemaDefinition {
  schemaType: "union";
  subSchemas: UnionSubSchema[];
}

type SchemaDefinition = UnionSubSchema | UnionSchemaDefinition;

export default function schemaParser(schema: string): SchemaDefinition {
  if (schema.includes("|")) {
    // @ts-ignore
    const subSchemas = schema
      .split("|")
      .map((subSchema) => subSchema.trim())
      .map((subSchema) => schemaParser(subSchema));

    return { schemaType: "union", subSchemas: subSchemas as UnionSubSchema[] };
  }

  if (schema.endsWith("[]")) {
    const elementType = schema.slice(0, -2); // remove "[]"
    assertValidHandyType(elementType);

    return { schemaType: "array", elementType };
  }

  if (schema in handyTypes)
    return { schemaType: "basic", type: schema as AllHandyTypes };

  throw new EPP(`Invalid handy type: "${schema}".`, "INVALID_HANDY_TYPE");
}
