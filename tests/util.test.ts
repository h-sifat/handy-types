import parseSchema from "../src/schema-parser";
import { makeCacheStore } from "../src/util";

describe("makeCacheStore", () => {
  const { publicInterface, privateInterface } = makeCacheStore();

  beforeEach(() => {
    publicInterface.clear();
  });

  const schema = "integer[]";
  const schemaDefinition = parseSchema(schema);

  describe("privateInterface", () => {
    it("set(): stores a schema", () => {
      privateInterface.set(schema, schemaDefinition);
      expect(privateInterface.has(schema)).toBeTruthy();
      expect(privateInterface.get(schema)).toEqual(schemaDefinition);
    });
  });

  describe("publicInterface", () => {
    it("delete(): deletes a schema", () => {
      expect(publicInterface.size).toBe(0);

      privateInterface.set(schema, schemaDefinition);

      expect(publicInterface.size).toBe(1);
      expect(publicInterface.has(schema)).toBeTruthy();

      expect(publicInterface.delete(schema)).toBeTruthy();

      expect(publicInterface.size).toBe(0);
      expect(publicInterface.has(schema)).toBeFalsy();
    });

    it("clear(): clears all schema", () => {
      privateInterface.set(schema, schemaDefinition);
      privateInterface.set(schema + "_", schemaDefinition);

      expect(publicInterface.size).toBe(2);
      publicInterface.clear();
      expect(publicInterface.size).toBe(0);
    });
  });
});
