import _is from "./is";
import { makeCacheStore } from "./util";
import { handyTypes, typeNames } from "./types";
import type { ErrorInformation } from "./assert";
import schemaWiseIs from "./schemawise-validator";
import _assert, { schemaWiseAssert } from "./assert";
import parseSchema, { SchemaDefinition } from "./schema-parser";

interface Is {
  <Type>(schema: string, value: unknown): value is Type;
  cache<Type>(schema: string, value: unknown): value is Type;
}

interface Assert {
  <Type>(
    schema: string,
    value: unknown,
    errorInfo?: ErrorInformation
  ): asserts value is Type;
  cache<Type>(
    schema: string,
    value: unknown,
    errorInfo?: ErrorInformation
  ): asserts value is Type;
}

const {
  publicInterface: publicCacheInterface,
  privateInterface: privateCacheInterface,
} = makeCacheStore();

// --------------------- is --------------------
let is: Is;
// @ts-ignore
is = _is;
is.cache = <Type>(schema: string, value: unknown): value is Type => {
  const schemaDefinition = getSchemaDefinition({
    schema,
    privateCacheInterface,
  });

  return schemaWiseIs({ value, schema: schemaDefinition });
};

Object.freeze(is);
// --------------------- assert --------------------
let assert: Assert;
// @ts-ignore
assert = _assert;
assert.cache = <Type>(
  schema: string,
  value: unknown,
  errorInfo?: ErrorInformation
): asserts value is Type => {
  const schemaDefinition = getSchemaDefinition({
    schema,
    privateCacheInterface,
  });
  schemaWiseAssert(schemaDefinition, value, errorInfo);
};

Object.freeze(assert);

// -------------- exports --------------------------

export { is, assert, handyTypes, typeNames, publicCacheInterface as cache };

// -------------- utility --------------------------
interface GetSchemaDefinitionArgument {
  schema: string;
  privateCacheInterface: typeof privateCacheInterface;
}

function getSchemaDefinition(
  arg: GetSchemaDefinitionArgument
): SchemaDefinition {
  const { schema, privateCacheInterface } = arg;

  if (privateCacheInterface.has(schema))
    return privateCacheInterface.get(schema)!;
  else {
    const schemaDefinition = parseSchema(schema);
    privateCacheInterface.set(schema, schemaDefinition);
    return schemaDefinition;
  }
}
