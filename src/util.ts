import type { SchemaDefinition } from "./schema-parser";
import { handyTypes, AllHandyTypes } from "./types";

export class EPP extends Error {
  constructor(message: string, public code: string) {
    super(message);
  }
}

export function assertValidHandyType(
  type: string
): asserts type is AllHandyTypes {
  if (!(type in handyTypes))
    throw new EPP(`Invalid handy type: "${type}"`, "INVALID_HANDY_TYPE");
}

export function makeCacheStore() {
  const cacheStore: Map<string, SchemaDefinition> = new Map();

  const publicInterface = Object.freeze({
    get size() {
      return cacheStore.size;
    },
    has(schema: string) {
      return cacheStore.has(schema);
    },
    delete(schema: string) {
      return cacheStore.delete(schema);
    },
    clear() {
      cacheStore.clear();
    },
  });

  const privateInterface = Object.freeze({
    has(schema: string) {
      return cacheStore.has(schema);
    },
    get(schema: string) {
      return cacheStore.get(schema);
    },
    set(schema: string, schemaDefinition: SchemaDefinition): void {
      cacheStore.set(schema, schemaDefinition);
    },
  });

  return { privateInterface, publicInterface };
}
