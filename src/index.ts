type TypePredicate<Type> = (v: unknown) => v is Type;

type NumberPredicate = TypePredicate<number>;
type StringPredicate = TypePredicate<string>;
type ObjectPredicate = TypePredicate<object>;
type NullableObjectPredicate = TypePredicate<object | null>;
type ArrayPredicate = TypePredicate<unknown[]>;

interface Types {
  // Number types
  number: NumberPredicate;
  num: NumberPredicate;
  p_number: NumberPredicate;
  positive_number: NumberPredicate;
  n_number: NumberPredicate;
  negative_number: NumberPredicate;
  finite_num: NumberPredicate;
  natural_num: NumberPredicate;
  int: NumberPredicate;
  integer: NumberPredicate;
  p_int: NumberPredicate;
  positive_int: NumberPredicate;
  n_int: NumberPredicate;
  negative_int: NumberPredicate;
  odd: (v: number) => boolean;
  even: (v: number) => boolean;
  safe_int: NumberPredicate;

  // Byte wise int
  int8: NumberPredicate;
  uint8: NumberPredicate;
  int16: NumberPredicate;
  uint16: NumberPredicate;
  int32: NumberPredicate;
  uint32: NumberPredicate;

  // String types
  string: StringPredicate;
  es: StringPredicate;
  empty_string: StringPredicate;
  ne_string: StringPredicate;
  non_empty_string: StringPredicate;

  // Array Types
  array: ArrayPredicate;
  ea: ArrayPredicate;
  empty_array: ArrayPredicate;
  ne_array: ArrayPredicate;
  non_empty_array: ArrayPredicate;

  // Object Types
  object: NullableObjectPredicate;
  nn_object: ObjectPredicate;
  non_null_object: ObjectPredicate;
  ne_object: ObjectPredicate;
  non_empty_object: ObjectPredicate;
  eo: ObjectPredicate;
  empty_object: ObjectPredicate;

  // Global Objects
  regex: TypePredicate<RegExp>;
  date: TypePredicate<Date>;
  set: TypePredicate<Set<unknown>>;
  map: TypePredicate<Map<unknown, unknown>>;
  function: TypePredicate<Function>;

  // Symbol Type
  symbol: TypePredicate<Symbol>;

  // Boolean Type
  boolean: TypePredicate<boolean>;
  truthy: (v: unknown) => boolean;
  falsy: (v: unknown) => boolean;

  // Constant Type
  true: TypePredicate<true>;
  false: TypePredicate<false>;
  undefined: TypePredicate<undefined>;
  null: TypePredicate<null>;
  NaN: TypePredicate<typeof NaN>;

  // Other types
  defined: (v: unknown) => boolean;
  any: (v: unknown) => true;
}

const types: Partial<Types> = {};

// Number Types ----------------------------------------------------------------
types.number = (v): v is number => typeof v === "number" && !Number.isNaN(v);
types.num = types.number;
types.p_number = (v): v is number => types.number!(v) && v >= 0;
types.positive_number = types.p_number;
types.n_number = (v): v is number => types.number!(v) && v < 0;
types.negative_number = types.n_number;
types.finite_num = (v): v is number => Number.isFinite(v);

// Integer Types ===============
types.int = (v): v is number => Number.isInteger(v);
types.integer = types.int;
types.safe_int = (v): v is number => Number.isSafeInteger(v);
types.p_int = (v): v is number => types.int!(v) && v > -1;
types.positive_int = types.p_int;
types.n_int = (v): v is number => types.int!(v) && v < 0;
types.negative_int = types.n_int;
types.natural_num = (v): v is number => types.int!(v) && v > 0;
types.odd = (v: number) => Math.abs(v % 2) === 1;
types.even = (v: number) => v % 2 === 0;

// byte wise integer
types.int8 = (v: unknown): v is number =>
  types.int!(v) && v >= -128 && v <= 127;
types.uint8 = (v: unknown): v is number => types.int!(v) && v >= 0 && v <= 255;
types.int16 = (v: unknown): v is number =>
  types.int!(v) && v >= -32768 && v <= 32767;
types.uint16 = (v: unknown): v is number =>
  types.int!(v) && v >= 0 && v <= 65535;
types.int32 = (v: unknown): v is number =>
  types.int!(v) && v >= -2147483648 && v <= 2147483647;
types.uint32 = (v: unknown): v is number =>
  types.int!(v) && v >= 0 && v <= 4294967295;

// String Types ----------------------------------------------------------------
types.string = (v): v is string => typeof v === "string";
types.es = (v): v is string => v === "";
types.empty_string = types.es;
types.ne_string = (v): v is string => types.string!(v) && v !== "";
types.non_empty_string = types.ne_string;

// Object Types ----------------------------------------------------------------
types.object = (v): v is object | null => typeof v === "object";
types.nn_object = (v): v is object => v !== null && types.object!(v);
types.non_null_object = types.nn_object;
types.ne_object = (v): v is object =>
  types.nn_object!(v) && Object.keys(v).length > 0;
types.non_empty_object = types.ne_object;
types.eo = (v): v is object =>
  types.nn_object!(v) && Object.keys(v).length === 0;
types.empty_object = types.eo;

// Array Types -----------------------------------------------------------------
types.array = (v): v is unknown[] => Array.isArray(v);
types.ea = (v): v is unknown[] => types.array!(v) && v.length === 0;
types.empty_array = types.ea;
types.ne_array = (v): v is unknown[] => types.array!(v) && v.length > 0;
types.non_empty_array = types.ne_array;

// Global Object Types ---------------------------------------------------------
types.regex = (v): v is RegExp => v instanceof RegExp;
types.date = (v): v is Date => v instanceof Date;
types.set = (v): v is Set<unknown> => v instanceof Set;
types.map = (v): v is Map<unknown, unknown> => v instanceof Map;
types.function = (v): v is Function => typeof v === "function";

// Global Object Types ---------------------------------------------------------
types.symbol = (v): v is Symbol => typeof v === "symbol";

// Boolean Types ---------------------------------------------------------------
types.boolean = (v): v is boolean => typeof v === "boolean";

// Constants Types -------------------------------------------------------------
types.true = (v): v is true => v === true;
types.false = (v): v is false => v === false;
types.undefined = (v): v is undefined => v === undefined;
types.null = (v): v is null => v === null;
types.NaN = (v): v is typeof NaN => Number.isNaN(v);

// Other Types  ----------------------------------------------------------------
types.truthy = (v) => !!v === true;
types.falsy = (v) => !!v === false;
types.defined = (v) => v !== undefined;
types.any = () => true;

// ---------------------------- Type Names -------------------------------------
type TypeNames = Readonly<Record<keyof Types, string>>;

let typeNames: TypeNames = {
  // Number
  number: "Number",
  num: "Number",
  p_number: "Positive Number",
  positive_number: "Positive Number",
  n_number: "Negative Number",
  negative_number: "Negative Number",
  finite_num: "Finite Number",

  // Integer
  integer: "Integer",
  int: "Integer",
  safe_int: "Safe Integer",
  p_int: "Positive Integer",
  positive_int: "Positive Integer",
  n_int: "Negative Integer",
  negative_int: "Negative Integer",
  odd: "Odd Number",
  even: "Even Number",
  natural_num: "Natural Number",

  // Byte wise integer
  int8: "8 Bit Integer",
  uint8: "8 Bit Unsigned Integer",
  int16: "16 Bit Integer",
  uint16: "16 Bit Unsigned Integer",
  int32: "32 Bit Integer",
  uint32: "32 Bit Unsigned Integer",

  // String
  string: "String",
  es: "Empty String",
  empty_string: "Empty String",
  ne_string: "Non-Empty String",
  non_empty_string: "Non-Empty String",

  // Object
  object: "Object",
  eo: "Empty Object",
  empty_object: "Empty Object",
  nn_object: "Non-Null Object",
  non_null_object: "Non-Null Object",
  ne_object: "Non-Empty Object",
  non_empty_object: "Non-Empty Object",

  // Array
  array: "Array",
  ea: "Empty Array",
  empty_array: "Empty Array",
  ne_array: "Non-Empty Array",
  non_empty_array: "Non-Empty Array",

  // Global objects
  set: "Set",
  map: "Map",
  regex: "Regular Expression",
  date: "Date",
  function: "Function",

  // Symbol
  symbol: "Symbol",

  // Boolean
  boolean: "Boolean",
  truthy: "Truthy",
  falsy: "Falsy",

  // Other
  defined: "Defined",
  any: "Any",

  // Constants
  undefined: "Undefined",
  null: "Null",
  true: "True",
  false: "False",
  NaN: "NaN",
};

type ReadonlyTypes = Readonly<Types> & {
  [key: string]: (v: unknown) => boolean;
};
const frozenTypeObject = Object.freeze(types) as ReadonlyTypes;
typeNames = Object.freeze(typeNames);

export { frozenTypeObject as types };
export { typeNames };
