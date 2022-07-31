type AllBasicTypes =
  | boolean
  | number
  | string
  | symbol
  | bigint
  | object
  | undefined
  | null // I know that null is not a type
  | Function;

const allTypeCategories = Object.freeze([
  "undefined",
  "boolean",
  "number",
  "string",
  "symbol",
  "object",
  "array",
  "function",
  "other",
  "bigint",
] as const);

type TypePredicate<Type, Category extends typeof allTypeCategories[number]> = {
  (v: unknown): v is Type;
  category: Category;
};

type NumberPredicate = TypePredicate<number, "number">;
type StringPredicate = TypePredicate<string, "string">;
type ObjectPredicate = TypePredicate<object, "object">;
type ArrayPredicate = TypePredicate<unknown[], "array">;
type NullableObjectPredicate = TypePredicate<object | null, "object">;

type NullishValue = undefined | null;

interface Types {
  // Base types
  undefined: TypePredicate<undefined, "undefined">;
  boolean: TypePredicate<boolean, "boolean">;
  number: NumberPredicate;
  big_integer: TypePredicate<BigInt, "bigint">;
  symbol: TypePredicate<Symbol, "symbol">;
  string: StringPredicate;
  object: NullableObjectPredicate;
  function: TypePredicate<Function, "function">;

  // Number types
  finite_number: NumberPredicate;

  positive_number: NumberPredicate;
  non_negative_number: NumberPredicate;

  negative_number: NumberPredicate;
  non_positive_number: NumberPredicate;

  // Integer Types
  integer: NumberPredicate;
  safe_integer: NumberPredicate;

  positive_integer: NumberPredicate;
  non_negative_integer: NumberPredicate;

  negative_integer: NumberPredicate;
  non_positive_integer: NumberPredicate;

  // Byte wise int
  "8bit_integer": NumberPredicate;
  "8bit_unsigned_integer": NumberPredicate;
  "16bit_integer": NumberPredicate;
  "16bit_unsigned_integer": NumberPredicate;
  "32bit_integer": NumberPredicate;
  "32bit_unsigned_integer": NumberPredicate;

  // String types
  non_empty_string: StringPredicate;

  // Array Types
  array: ArrayPredicate;
  non_empty_array: ArrayPredicate;

  // Object Types
  plain_object: ObjectPredicate;
  non_null_object: ObjectPredicate;

  // Other types
  any: TypePredicate<any, "other">;
  nan: TypePredicate<typeof NaN, "other">;
  nullish: TypePredicate<NullishValue, "other">;
  non_nullish: {
    (v: AllBasicTypes): v is Exclude<AllBasicTypes, NullishValue>;
    category: "other";
  };
}

const types: Partial<Types> = {};

// Implementation -------------------------------------------------------------
types.undefined = Object.assign(
  (v: unknown): v is undefined => typeof v === "undefined",
  { category: "undefined" } as const
);

types.number = Object.assign(
  (v: unknown): v is number => typeof v === "number" && !Number.isNaN(v),
  { category: "number" } as const
);
types.positive_number = Object.assign(
  (v: unknown): v is number => types.number!(v) && v > 0,
  { category: "number" } as const
);

types.non_negative_number = Object.assign(
  (v: unknown): v is number => types.number!(v) && v >= 0,
  { category: "number" } as const
);

types.negative_number = Object.assign(
  (v: unknown): v is number => types.number!(v) && v < 0,
  { category: "number" } as const
);

types.non_positive_number = Object.assign(
  (v: unknown): v is number => types.number!(v) && v <= 0,
  { category: "number" } as const
);

types.finite_number = Object.assign(
  (v: unknown): v is number => Number.isFinite(v),
  { category: "number" } as const
);

// Integer Types ===============
types.integer = Object.assign(
  (v: unknown): v is number => Number.isInteger(v),
  { category: "number" } as const
);
types.safe_integer = Object.assign(
  (v: unknown): v is number => Number.isSafeInteger(v),
  { category: "number" } as const
);

types.big_integer = Object.assign(
  (v: unknown): v is BigInt => typeof v === "bigint",
  { category: "bigint" } as const
);

types.positive_integer = Object.assign(
  (v: unknown): v is number => types.integer!(v) && v > 0,
  { category: "number" } as const
);

types.negative_integer = Object.assign(
  (v: unknown): v is number => types.integer!(v) && v < 0,
  { category: "number" } as const
);

types.non_positive_integer = Object.assign(
  (v: unknown): v is number => types.integer!(v) && v < 1,
  { category: "number" } as const
);

types.non_negative_integer = Object.assign(
  (v: unknown): v is number => types.integer!(v) && v >= 0,
  { category: "number" } as const
);

// byte wise integer
types["8bit_integer"] = Object.assign(
  (v: unknown): v is number => types.integer!(v) && v >= -128 && v <= 127,
  { category: "number" } as const
);

types["8bit_unsigned_integer"] = Object.assign(
  (v: unknown): v is number => types.integer!(v) && v >= 0 && v <= 255,
  { category: "number" } as const
);

types["16bit_integer"] = Object.assign(
  (v: unknown): v is number => types.integer!(v) && v >= -32768 && v <= 32767,
  { category: "number" } as const
);

types["16bit_unsigned_integer"] = Object.assign(
  (v: unknown): v is number => types.integer!(v) && v >= 0 && v <= 65535,
  { category: "number" } as const
);

types["32bit_integer"] = Object.assign(
  (v: unknown): v is number =>
    types.integer!(v) && v >= -2147483648 && v <= 2147483647,
  { category: "number" } as const
);

types["32bit_unsigned_integer"] = Object.assign(
  (v: unknown): v is number => types.integer!(v) && v >= 0 && v <= 4294967295,
  { category: "number" } as const
);

// String Types ----------------------------------------------------------------
types.string = Object.assign(
  (v: unknown): v is string => typeof v === "string",
  { category: "string" } as const
);
types.non_empty_string = Object.assign(
  (v: unknown): v is string => types.string!(v) && v !== "",
  { category: "string" } as const
);

// Object Types ----------------------------------------------------------------
types.object = Object.assign(
  (v: unknown): v is object | null => typeof v === "object",
  { category: "object" } as const
);
types.non_null_object = Object.assign(
  (v: unknown): v is object => v !== null && types.object!(v),
  { category: "object" } as const
);
types.plain_object = Object.assign(
  (v: unknown): v is object => types.non_null_object!(v) && !Array.isArray(v),
  { category: "object" } as const
);

// Array Types -----------------------------------------------------------------
types.array = Object.assign((v: unknown): v is unknown[] => Array.isArray(v), {
  category: "array",
} as const);
types.non_empty_array = Object.assign(
  (v: unknown): v is unknown[] => types.array!(v) && v.length > 0,
  { category: "array" } as const
);

types.function = Object.assign(
  (v: unknown): v is Function => typeof v === "function",
  { category: "function" } as const
);
types.symbol = Object.assign(
  (v: unknown): v is Symbol => typeof v === "symbol",
  { category: "symbol" } as const
);
types.boolean = Object.assign(
  (v: unknown): v is boolean => typeof v === "boolean",
  { category: "boolean" } as const
);

types.nan = Object.assign((v: unknown): v is typeof NaN => Number.isNaN(v), {
  category: "other",
} as const);

// Other Types  ----------------------------------------------------------------
types.any = Object.assign((v: unknown): v is any => true, {
  category: "other",
} as const);
types.nullish = Object.assign(
  (v: unknown): v is NullishValue => v === undefined || v === null,
  { category: "other" } as const
);
types.non_nullish = Object.assign(
  (v: unknown): v is Exclude<AllBasicTypes, NullishValue> => !types.nullish!(v),
  { category: "other" } as const
);

// ---------------------------- Type Names -------------------------------------
type TypeNames = Readonly<Record<keyof Types, string>>;

const typeNames: TypeNames = {
  // Base Types
  undefined: "Undefined",
  boolean: "Boolean",
  number: "Number",
  big_integer: "Big Integer",
  symbol: "Symbol",
  string: "String",
  object: "Object",
  function: "Function",

  finite_number: "Finite Number",

  positive_number: "Positive Number",
  non_negative_number: "Non Negative Number",

  negative_number: "Negative Number",
  non_positive_number: "Non Positive Number",

  integer: "Integer",
  safe_integer: "Safe Integer",

  positive_integer: "Positive Integer",
  non_negative_integer: "Non Negative Integer",

  negative_integer: "Negative Integer",
  non_positive_integer: "Non Positive Integer",

  "8bit_integer": "8 Bit Integer",
  "8bit_unsigned_integer": "8 Bit Unsigned Integer",
  "16bit_integer": "16 Bit Integer",
  "16bit_unsigned_integer": "16 Bit Unsigned Integer",
  "32bit_integer": "32 Bit Integer",
  "32bit_unsigned_integer": "32 Bit Unsigned Integer",

  non_empty_string: "Non-Empty String",

  plain_object: "Plain Object",
  non_null_object: "Non-Null Object",

  array: "Array",
  non_empty_array: "Non-Empty Array",

  nan: "NaN",
  any: "Any",
  nullish: "Nullish",
  non_nullish: "Non-Nullish",
};

const frozenTypeObject = Object.freeze(types) as Readonly<Types>;
const frozenTypeNames = Object.freeze(typeNames);

export { frozenTypeObject as types, frozenTypeNames as typeNames };
