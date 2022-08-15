import { allTypeCategories, handyTypes, typeNames } from "../src/types";

const testData = [
  // Number types ------------------------------
  {
    typeName: "number",
    validValues: [1, 0.111, 0.0000000000001, 1e2, 0x24, 0b1010, 0o234],
    invalidValues: ["1", null, NaN],
  },
  {
    typeName: "non_negative_number",
    validValues: [0, 1, 0.0000000001],
    invalidValues: [-1, -0.000000002],
  },
  {
    typeName: "positive_number",
    validValues: [1, 0.0000000001, 2],
    invalidValues: [-1, -0.000000002, 0],
  },
  {
    typeName: "negative_number",
    validValues: [-1, -0.000000002],
    invalidValues: [0, 1, 0.0000000001],
  },
  {
    typeName: "non_positive_number",
    validValues: [0, -1, -0.000000002],
    invalidValues: [1, 0.0000000001],
  },
  {
    typeName: "finite_number",
    validValues: [1, 0, 9999999],
    invalidValues: [Infinity, 1 / 0, -Infinity],
  },

  // Integer types ------------------------------------
  {
    typeName: "big_integer",
    validValues: [BigInt(3), BigInt("3")],
    invalidValues: [1, 3, -3, 0],
  },
  {
    typeName: "integer",
    validValues: [1, 2, 0, -1, -2, 2.0],
    invalidValues: [1.1, 0.11],
  },
  {
    typeName: "positive_integer",
    validValues: [1, 2, 3],
    invalidValues: [0, -1, -2],
  },

  {
    typeName: "non_negative_integer",
    validValues: [0, 1, 2, 3],
    invalidValues: [-1, -2, -3],
  },

  {
    typeName: "negative_integer",
    validValues: [-1, -2, -3],
    invalidValues: [0, 1, 2, 3],
  },
  {
    typeName: "non_positive_integer",
    validValues: [0, -1, -2],
    invalidValues: [1, 2],
  },
  {
    typeName: "8bit_integer",
    validValues: [-128, 127],
    invalidValues: [-129, 128],
  },
  {
    typeName: "8bit_unsigned_integer",
    validValues: [0, 255],
    invalidValues: [-1, 256],
  },
  {
    typeName: "16bit_integer",
    validValues: [-32768, 32767],
    invalidValues: [-32769, 32768],
  },
  {
    typeName: "16bit_unsigned_integer",
    validValues: [0, 65535],
    invalidValues: [-1, 65536],
  },
  {
    typeName: "32bit_integer",
    validValues: [-2147483648, 2147483647],
    invalidValues: [-2147483649, 2147483648],
  },
  {
    typeName: "32bit_unsigned_integer",
    validValues: [0, 4294967295],
    invalidValues: [-1, 4294967296],
  },
  {
    typeName: "safe_integer",
    validValues: [1, 2, 0, -1, -2, 2.0, 9999999],
    invalidValues: [1.1, 0.11, 99999999999999999999999999999],
  },
  // String types
  {
    typeName: "string",
    validValues: ["a", "", `fa`, "df"],
    invalidValues: [1, null, new String("sa")],
  },
  {
    typeName: "non_empty_string",
    validValues: ["a", "bcd"],
    invalidValues: [""],
  },

  // Object types ---------------------------------
  {
    typeName: "object",
    validValues: [null, {}, [], /hi/, JSON, { name: "duck" }],
    invalidValues: [1, 2, undefined, "not_object"],
  },
  {
    typeName: "plain_object",
    validValues: [{}, /hi/, JSON, { name: "duck" }],
    invalidValues: [[1], new Array(4)],
  },
  {
    typeName: "non_null_object",
    validValues: [{}, [], JSON],
    invalidValues: [null],
  },
  // Array types --------------------------------
  {
    typeName: "array",
    validValues: [[], [1, 2, 3], new Array(1, 2, 3)],
    invalidValues: [null, { length: 1, 0: 1 }],
  },
  {
    typeName: "non_empty_array",
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
    typeName: "function",
    validValues: [() => {}, function x() {}, String, class A {}],
    invalidValues: [1, "a", undefined],
  },

  {
    typeName: "symbol",
    validValues: [Symbol(), Symbol("sdf")],
    invalidValues: ["a", null, undefined],
  },
  {
    typeName: "undefined",
    validValues: [undefined],
    invalidValues: [null, false, 0],
  },
  {
    typeName: "nan",
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
  {
    typeName: "non_nullish",
    validValues: [false, 0, NaN, "", "hey", {}],
    invalidValues: [null, undefined],
  },
] as const;

// --------------- [Not related to tests]-----------------------------------

type AllUsedTypesInTestData = typeof testData[number]["typeName"];
type MissingTypesInTestData = Exclude<
  keyof typeof handyTypes,
  AllUsedTypesInTestData
>;
let _exhaustiveCheck_isAnyTestMissingInTestData: never =
  undefined as unknown as MissingTypesInTestData;
_exhaustiveCheck_isAnyTestMissingInTestData;

type TestDataItem = Readonly<{
  typeName: keyof typeof handyTypes;
  validValues: readonly any[];
  invalidValues: readonly any[];
}>;
let _exhaustiveCheck_isTestDataArrayValid: readonly TestDataItem[] = testData;
_exhaustiveCheck_isTestDataArrayValid;
// --------------- [End of Not related to tests]-------------------------------

describe.each(testData)(
  "types.$typeName()",
  ({ typeName, validValues, invalidValues }) => {
    // @ts-ignore
    const validator = handyTypes[<string>typeName];

    // for array we can't use use the it.each! why? see the jest doc for test.each
    if (typeName.endsWith("array")) {
      for (const value of validValues) {
        it(`${typeName}(${JSON.stringify(value)}) === true`, () => {
          expect(validator(value)).toBeTruthy();
        });
      }

      for (const value of invalidValues) {
        it(`${typeName}(${JSON.stringify(value)}) === false`, () => {
          expect(validator(value)).toBeFalsy();
        });
      }
      return;
    } // End of for array types

    it.concurrent.each(validValues)(`${typeName}(%p) === true`, (value) => {
      expect(validator(value)).toBeTruthy();
    });

    if (invalidValues.length)
      it.concurrent.each(invalidValues)(
        `${typeName}(%p) === false`,
        (value) => {
          expect(validator(value)).toBeFalsy();
        }
      );
  }
);

describe("Number of Properties", () => {
  test("types and typeName has equal number of props", () => {
    expect(Object.keys(handyTypes)).toHaveLength(Object.keys(typeNames).length);
  });

  test("typeNames has all the fullnames of types", () => {
    expect(
      Object.keys(handyTypes).every((type) => type in typeNames)
    ).toBeTruthy();
  });
});

describe("Other", () => {
  test("every handyTypes function has a category associated with it", () => {
    const doesEveryTypeHasACategory = Object.values(handyTypes).reduce(
      (result, type) => {
        return (result &&=
          typeof type.category === "string" &&
          allTypeCategories.includes(type.category));
      },
      true
    );
    expect(doesEveryTypeHasACategory).toBeTruthy();
  });
});
