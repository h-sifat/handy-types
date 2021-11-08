import { types, typeNames } from "../src";

const testData = [
  // Number types ------------------------------
  {
    typeName: "number",
    validValues: [1, 0.111, 0.0000000000001, 1e2, 0x24, 0b1010, 0o234],
    invalidValues: ["1", null, NaN],
  },
  {
    typeName: "p_number",
    validValues: [0, 1, 0.0000000001],
    invalidValues: [-1, -0.000000002],
  },
  {
    typeName: "n_number",
    validValues: [-1, -0.000000002],
    invalidValues: [0, 1, 0.0000000001],
  },

  {
    typeName: "finite_num",
    validValues: [1, 0, 9999999],
    invalidValues: [Infinity, 1 / 0, -Infinity],
  },

  // Integer types ------------------------------------
  {
    typeName: "int",
    validValues: [1, 2, 0, -1, -2, 2.0],
    invalidValues: [1.1, 0.11],
  },
  {
    typeName: "int8",
    validValues: [-128, 127],
    invalidValues: [-129, 128],
  },
  {
    typeName: "uint8",
    validValues: [0, 255],
    invalidValues: [-1, 256],
  },
  {
    typeName: "int16",
    validValues: [-32768, 32767],
    invalidValues: [-32769, 32768],
  },
  {
    typeName: "uint16",
    validValues: [0, 65535],
    invalidValues: [-1, 65536],
  },
  {
    typeName: "int32",
    validValues: [-2147483648, 2147483647],
    invalidValues: [-2147483649, 2147483648],
  },
  {
    typeName: "uint32",
    validValues: [0, 4294967295],
    invalidValues: [-1, 4294967296],
  },
  {
    typeName: "safe_int",
    validValues: [1, 2, 0, -1, -2, 2.0, 9999999],
    invalidValues: [1.1, 0.11, 99999999999999999999999999999],
  },
  {
    typeName: "p_int",
    validValues: [0, 1, 3],
    invalidValues: [-1, -2, -3],
  },
  {
    typeName: "n_int",
    validValues: [-1, -2, -3],
    invalidValues: [0, 1, 3],
  },
  {
    typeName: "natural_num",
    validValues: [1, 2, 3],
    invalidValues: [0, -1, -2],
  },
  {
    typeName: "odd",
    validValues: [1, 3, -1, -3],
    invalidValues: [0, 2, -2],
  },
  {
    typeName: "even",
    validValues: [-2, -4, 0, 2, 4],
    invalidValues: [-3, -1, 1, 3, 5],
  },

  // String types
  {
    typeName: "string",
    validValues: ["a", "", `fa`, "df"],
    invalidValues: [1, null, new String("sa")],
  },
  {
    typeName: "ne_string",
    validValues: ["a", "bcd"],
    invalidValues: [""],
  },
  {
    typeName: "es",
    validValues: ["", "", ``],
    invalidValues: ["a", new String("")],
  },

  // Object types ---------------------------------
  {
    typeName: "object",
    validValues: [null, {}, [], /hi/, JSON, { name: "useless shit" }],
    invalidValues: [1, 2, undefined, "afsd"],
  },
  {
    typeName: "nn_object",
    validValues: [{}, [], JSON],
    invalidValues: [null],
  },
  {
    typeName: "ne_object",
    validValues: [{ a: 1 }, { a: 1, b: 2 }],
    invalidValues: [{}, null, "ad"],
  },
  {
    typeName: "eo",
    validValues: [{}],
    invalidValues: ["a", { a: 1 }],
  },

  // Array types --------------------------------
  {
    typeName: "ea",
    validValues: [[], new Array()],
    invalidValues: ["a", { a: 1 }, [1]],
  },
  {
    typeName: "array",
    validValues: [[], [1, 2, 3], new Array(1, 2, 3)],
    invalidValues: [null, { length: 1, 0: 1 }],
  },
  {
    typeName: "ne_array",
    validValues: [[1], [1, 2]],
    invalidValues: [[], null, undefined, {}],
  },

  // Boolean -----------------------------------
  {
    typeName: "boolean",
    validValues: [true, false],
    invalidValues: ["a", 1, undefined, {}],
  },
  {
    typeName: "truthy",
    validValues: [1, "ab", {}, []],
    invalidValues: [null, undefined, false, "", 0, NaN],
  },
  {
    typeName: "falsy",
    validValues: [null, undefined, false, "", 0, NaN],
    invalidValues: [1, "ab", {}, []],
  },

  // Global objects ------------------------------
  {
    typeName: "regex",
    validValues: [/hi/, new RegExp("hi", "g")],
    invalidValues: [{}, "hi"],
  },
  {
    typeName: "date",
    validValues: [new Date()],
    invalidValues: [{}, "hi"],
  },
  {
    typeName: "set",
    validValues: [new Set()],
    invalidValues: [null, {}, []],
  },
  {
    typeName: "map",
    validValues: [new Map()],
    invalidValues: [null, {}, []],
  },

  // Function ------------------------
  {
    typeName: "function",
    validValues: [() => {}, function x() {}, String],
    invalidValues: [1, "a", undefined],
  },

  // Symbol ---------------
  {
    typeName: "symbol",
    validValues: [Symbol(), Symbol("sdf")],
    invalidValues: ["a", null, undefined],
  },

  // Defined -------------------
  {
    typeName: "defined",
    validValues: [null, false, "", 0, NaN],
    invalidValues: [undefined],
  },

  // Constants ----------------
  {
    typeName: "null",
    validValues: [null],
    invalidValues: [undefined, "a"],
  },
  {
    typeName: "undefined",
    validValues: [undefined],
    invalidValues: [null, false, 0],
  },
  {
    typeName: "true",
    validValues: [true],
    invalidValues: [false, "a"],
  },
  {
    typeName: "false",
    validValues: [false],
    invalidValues: [true, "a"],
  },
  {
    typeName: "NaN",
    validValues: [NaN],
    invalidValues: [true, "a"],
  },
  {
    typeName: "any",
    validValues: [1, "a", {}, null, undefined, 0, []],
    invalidValues: [],
  },
  {
    typeName: "nullish",
    validValues: [null, undefined],
    invalidValues: [false, 0, NaN, "", "hey", {}],
  },
];

describe.each(testData)(
  "types.$typeName()",
  ({ typeName, validValues, invalidValues }) => {
    const validator = types[<string>typeName];

    it("should return true for all valid values", () => {
      validValues.forEach((value) => expect(validator(value)).toBe(true));
    });

    it("should return false for all invalid values", () => {
      invalidValues.forEach((value) => expect(validator(value)).toBe(false));
    });
  }
);

describe("Number of Properties", () => {
  test("types and typeName has equal number of props", () => {
    expect(Object.keys(types)).toHaveLength(Object.keys(typeNames).length);
  });

  test("typeNames has all the fullnames of types", () => {
    expect(Object.keys(types).every((type) => type in typeNames)).toBeTruthy();
  });
});
