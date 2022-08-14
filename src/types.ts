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

export interface HandyTypes_Interface {
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
    (v: unknown): v is Exclude<AllBasicTypes, NullishValue>;
    category: "other";
  };
}

const handyTypes: Partial<HandyTypes_Interface> = {};

// Implementation -------------------------------------------------------------
handyTypes.undefined = Object.assign(
  (v: unknown): v is undefined => typeof v === "undefined",
  { category: "undefined" } as const
);

handyTypes.number = Object.assign(
  (v: unknown): v is number => typeof v === "number" && !Number.isNaN(v),
  { category: "number" } as const
);
handyTypes.positive_number = Object.assign(
  (v: unknown): v is number => handyTypes.number!(v) && v > 0,
  { category: "number" } as const
);

handyTypes.non_negative_number = Object.assign(
  (v: unknown): v is number => handyTypes.number!(v) && v >= 0,
  { category: "number" } as const
);

handyTypes.negative_number = Object.assign(
  (v: unknown): v is number => handyTypes.number!(v) && v < 0,
  { category: "number" } as const
);

handyTypes.non_positive_number = Object.assign(
  (v: unknown): v is number => handyTypes.number!(v) && v <= 0,
  { category: "number" } as const
);

handyTypes.finite_number = Object.assign(
  (v: unknown): v is number => Number.isFinite(v),
  { category: "number" } as const
);

// Integer Types ===============
handyTypes.integer = Object.assign(
  (v: unknown): v is number => Number.isInteger(v),
  { category: "number" } as const
);
handyTypes.safe_integer = Object.assign(
  (v: unknown): v is number => Number.isSafeInteger(v),
  { category: "number" } as const
);

handyTypes.big_integer = Object.assign(
  (v: unknown): v is BigInt => typeof v === "bigint",
  { category: "bigint" } as const
);

handyTypes.positive_integer = Object.assign(
  (v: unknown): v is number => handyTypes.integer!(v) && v > 0,
  { category: "number" } as const
);

handyTypes.negative_integer = Object.assign(
  (v: unknown): v is number => handyTypes.integer!(v) && v < 0,
  { category: "number" } as const
);

handyTypes.non_positive_integer = Object.assign(
  (v: unknown): v is number => handyTypes.integer!(v) && v < 1,
  { category: "number" } as const
);

handyTypes.non_negative_integer = Object.assign(
  (v: unknown): v is number => handyTypes.integer!(v) && v >= 0,
  { category: "number" } as const
);

// byte wise integer
handyTypes["8bit_integer"] = Object.assign(
  (v: unknown): v is number => handyTypes.integer!(v) && v >= -128 && v <= 127,
  { category: "number" } as const
);

handyTypes["8bit_unsigned_integer"] = Object.assign(
  (v: unknown): v is number => handyTypes.integer!(v) && v >= 0 && v <= 255,
  { category: "number" } as const
);

handyTypes["16bit_integer"] = Object.assign(
  (v: unknown): v is number =>
    handyTypes.integer!(v) && v >= -32768 && v <= 32767,
  { category: "number" } as const
);

handyTypes["16bit_unsigned_integer"] = Object.assign(
  (v: unknown): v is number => handyTypes.integer!(v) && v >= 0 && v <= 65535,
  { category: "number" } as const
);

handyTypes["32bit_integer"] = Object.assign(
  (v: unknown): v is number =>
    handyTypes.integer!(v) && v >= -2147483648 && v <= 2147483647,
  { category: "number" } as const
);

handyTypes["32bit_unsigned_integer"] = Object.assign(
  (v: unknown): v is number =>
    handyTypes.integer!(v) && v >= 0 && v <= 4294967295,
  { category: "number" } as const
);

// String Types ----------------------------------------------------------------
handyTypes.string = Object.assign(
  (v: unknown): v is string => typeof v === "string",
  { category: "string" } as const
);
handyTypes.non_empty_string = Object.assign(
  (v: unknown): v is string => handyTypes.string!(v) && v !== "",
  { category: "string" } as const
);

// Object Types ----------------------------------------------------------------
handyTypes.object = Object.assign(
  (v: unknown): v is object | null => typeof v === "object",
  { category: "object" } as const
);
handyTypes.non_null_object = Object.assign(
  (v: unknown): v is object => v !== null && handyTypes.object!(v),
  { category: "object" } as const
);
handyTypes.plain_object = Object.assign(
  (v: unknown): v is object =>
    handyTypes.non_null_object!(v) && !Array.isArray(v),
  { category: "object" } as const
);

// Array Types -----------------------------------------------------------------
handyTypes.array = Object.assign(
  (v: unknown): v is unknown[] => Array.isArray(v),
  {
    category: "array",
  } as const
);
handyTypes.non_empty_array = Object.assign(
  (v: unknown): v is unknown[] => handyTypes.array!(v) && v.length > 0,
  { category: "array" } as const
);

handyTypes.function = Object.assign(
  (v: unknown): v is Function => typeof v === "function",
  { category: "function" } as const
);
handyTypes.symbol = Object.assign(
  (v: unknown): v is Symbol => typeof v === "symbol",
  { category: "symbol" } as const
);
handyTypes.boolean = Object.assign(
  (v: unknown): v is boolean => typeof v === "boolean",
  { category: "boolean" } as const
);

handyTypes.nan = Object.assign(
  (v: unknown): v is typeof NaN => Number.isNaN(v),
  {
    category: "other",
  } as const
);

// Other Types  ----------------------------------------------------------------
handyTypes.any = Object.assign((v: unknown): v is any => true, {
  category: "other",
} as const);
handyTypes.nullish = Object.assign(
  (v: unknown): v is NullishValue => v === undefined || v === null,
  { category: "other" } as const
);
handyTypes.non_nullish = Object.assign(
  (v: unknown): v is Exclude<AllBasicTypes, NullishValue> =>
    !handyTypes.nullish!(v),
  { category: "other" } as const
);

// ---------------------------- Type Names -------------------------------------
type TypeNames = Readonly<Record<keyof HandyTypes_Interface, string>>;

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

const frozenTypeObject = Object.freeze(
  handyTypes
) as Readonly<HandyTypes_Interface>;
const frozenTypeNames = Object.freeze(typeNames);

export type AllHandyTypes = keyof HandyTypes_Interface;

export { frozenTypeObject as handyTypes, frozenTypeNames as typeNames };
