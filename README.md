# Handy-Types

![Module Type](https://img.shields.io/badge/Module%20Type-UMD-brightgreen)
![Npm Version](https://img.shields.io/npm/v/handy-types)
![GitHub Tag](https://img.shields.io/github/v/tag/h-sifat/handy-types)
![GitHub Issues](https://img.shields.io/github/issues/h-sifat/handy-types)

A simple and lite weight validation library to reduce boilerplate in your
JavaScript / TypeScript validation code.

It consists of many utility type predicate functions like `"integer"`,
`"positive_integer"`, `"non_empty_string"`, `"plain_object"` and so on. Still
not impressed? How about `"string[]"` to represent a string array or
`"non_empty_string | non_empty_string[]"` to represent a non empty string or an
array of non empty string(s)? TypeScript type annotation is also supported. The
library is fully tested and has **100%** test coverage.

## Importing

The library uses **UMD** module system so it's compatible with all JavaScript
module systems.

### JavaScript / TypeScript

```js
// es modules
import { is, assert, cache, handyTypes, typeNames } from "handy-types";

// commonjs modules
const { is, assert, cache, handyTypes, typeNames } = require("handy-types");
```

### In HTML with the `<script>` tag

```html
<script src="https://unpkg.com/handy-types"></script>
<!-- it will be available as a global object by the name "handy_types" -->
```

## Usages

This library exposes the following 5 entities

1. **handyTypes:** An object containing all the type predicate functions. For
   example, `handyTypes.positive_integer(2); // true`.

1. **typeNames:** An object containing all the names of predicate functions of
   `handyTypes`.
   For example: `typeNames["positive_integer"]; // "Positive Integer"`.
   It may be used to generate meaningful error messages.

1. **is:** a predicate function that uses all the functions in `handyTypes`
   object to validate data. For example, `is("string", "a string"); // true`. It
   has a `cache` method with the same function signature as itself. The
   `it.cache()` method can be used to cache parsed schemas to improve
   performance.

1. **assert:** a utility function similar to `is` but used for making
   assertions. It also has a `cache` method similar to `is`.

1. **cache:** An object used to manage schema caches of `is.cache()` and
   `assert.cache()` functions.

### Type schema syntax

A type schema is a string passed into the `is` and `assert` function to
represent a type. There are three types of type schema:

1. **Basic:** Just a simple handy type name such as `"string"`,
   `"non_empty_array"` etc.

1. **Array:** If we add the `"[]"` suffix after any handy type name it
   represents an array of that type. So `"string[]"` would represent and array
   of string.

1. **Union:** We can combine two or more type schema with a pipe `"|"` character
   to represent an union. For example, `"string | string[]"` to represent a
   string or an array of string(s).

## Usages of `is()`

The `is` predicate function has the following signature.

```ts
interface Is {
  <Type>(schema: string, value: unknown): value is Type;
  cache<Type>(schema: string, value: unknown): value is Type;
}
```

The reason it's a generic function with a type parameter named `Type` is to
support typescript type annotation. For example:

#### TypeScript Example

```ts
let value: unknown;

if (is<string | string[]>("non_empty_string | non_empty_string[]", value)) {
  value; // let value: string | string[]
}
```

In the if block the type of `value` variable is `string | string[]`. We've to
pass the type of value (`string | string[]`) manually because it's not possible
to process an union schema with TypeScript to determine it's actual type.

But if this seems a little bit of extra work to you then you can use the basic
type predicate functions directly from the `handyTypes` object . For
example:

```ts
let value: unknown;

if (handyTypes.integer(value)) {
  value; // let value: number
}
```

Here in the if block the type of `value` variable will be set to
`number` automatically. But the downsides of this approach are:

1. We can't use array or union type schemas
2. `handyTypes.integer(value)` doesn't seem intuitive because most of the time
   a predicate function starts with the word **is** as a convention.

#### JavaScript Example

For JavaScript just remove the generic type argument.

```js
const hobbies = "programming";
if (is("non_empty_string | non_empty_string[]", hobbies)) {
  hobbies;
  // so `hobbies` is either a non_empty_string or a
  // non_empty_string array
}
```

### Usages of `is.cache()`

Use the `is.cache()` function instead of `is` for **array** and **union**
schemas to improve performance. It will parse and cache the schema so that it
doesn't have to waste time parsing the same schema again and again.

#### TypeScript Example

```ts
if (is.cache<string | string[]>("string | string[]", value)) {
  value; // here value is of type: string | string[]
}
```

#### JavaScript Example

```ts
if (is.cache("string | string[]", value)) {
  value; // here value is of type: string | string[]
}
```

## Usages of `assert`

We can use the `assert` function to make assertions. It has the following
function signature:

```ts
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
```

Here `ErrorInformation` refers to the interface below.

```ts
interface ErrorInformation {
  name?: string;
  message?: string;
  code?: string | number;
  otherInfo?: object;
}
```

Just like the `is` function it takes a type schema and the variable we're making
assertion on as it's first and second arguments respectively. Then we can
provide more information in the `errorInfo` object to customize the error
object.

Examples:

```ts
let value: unknown;

assert<number>("integer", value);
// throws error: `Value must be of type Integer`

assert<number>("integer", value, {
  name: "Age",
  code: "INVALID_AGE",
});
// throws error: `Age must be of type Integer`, with code: "INVALID_AGE"

// Use custom message instead of generating one
assert<string>("non_empty_string", value, {
  message: "Invalid path",
  otherInfo: {
    path: value,
    errorId: -3,
  },
});
// throws error: `Invalid path` , path: undefined, errorId: -3
```

### Usages of `assert.cache()`

It serves the same purpose as `is.cache()`, it caches parsed schemas.

```ts
assert.cache<string | string[]>(
  "non_empty_string | non_empty_string[]",
  value,
  { name: "hobbies" }
); // use caching for improved performance
```

## Usages of the `cache` object

The `cache` object can be used to manage schema caches. It has the following
interface.

```ts
Readonly<{
  readonly size: number;
  has(schema: string): boolean;
  delete(schema: string): boolean;
  clear(): void;
}>;
```

Examples:

```ts
console.log(cache.size); // 0

const schema = "integer | integer[]";

is.cache<number | number[]>(schema, 23);

console.log(cache.size); // 1

console.log(cache.has(schema)); // true

// use the delete method to delete a specific schema cache
cache.delete(schema); // true

console.log(cache.size); // 0

// clear all caches
cache.clear();
```

## All handy types

Below are the lists of all the type predicates available in the `handyTypes`
object.

### Base Types

| Type Name   | Full Name   | Implementation                                      |
| ----------- | ----------- | --------------------------------------------------- |
| boolean     | Boolean     | `typeof value === "boolean"`                        |
| symbol      | Symbol      | `typeof value === "symbol"`                         |
| string      | String      | `typeof value === "string"`                         |
| object      | Object      | `typeof value === "object"`                         |
| big_integer | Big Integer | `typeof value === "bigint"`                         |
| function    | Function    | `typeof value === "function"`                       |
| undefined   | Undefined   | `typeof value === "undefined"`                      |
| **number**  | Number      | `typeof value === "number" && !Number.isNaN(value)` |

**Note:** The type `number` is not just `typeof value === "number"`!

### Number Types

| Type Name           | Full Name           | Implementation                   |
| ------------------- | ------------------- | -------------------------------- |
| finite_number       | Finite Number       | `Number.isFinite(n)`             |
| positive_number     | Positive Number     | `handyTypes.number(n) && n > 0`  |
| non_negative_number | Non Negative Number | `handyTypes.number(n) && n >= 0` |
| negative_number     | Negative Number     | `handyTypes.number(n) && n < 0`  |
| non_positive_number | Non Positive Number | `handyTypes.number(n) && n <= 0` |

### Integer Types

| Type Name            | Full Name            | Implementation                  |
| -------------------- | -------------------- | ------------------------------- |
| integer              | Integer              | `Number.isInteger(i)`           |
| safe_integer         | Safe Integer         | `Number.isSafeInteger(i)`       |
| positive_integer     | Positive Integer     | `Number.isInteger(i) && i > 0`  |
| non_negative_integer | Non Negative Integer | `Number.isInteger(i) && i >= 0` |
| negative_integer     | Negative Integer     | `Number.isInteger(i) && i < 0`  |
| non_positive_integer | Non Positive Integer | `Number.isInteger(i) && i <= 0` |

### Bytewise Integer Types

| Type Name              | Full Name               | Range                                   |
| ---------------------- | ----------------------- | --------------------------------------- |
| 8bit_integer           | 8 Bit Integer           | **-128** to **127**                     |
| 8bit_unsigned_integer  | 8 Bit Unsigned Integer  | **0** to **255**                        |
| 16bit_integer          | 16 Bit Integer          | **-32,768** to **32,767**               |
| 16bit_unsigned_integer | 16 Bit Unsigned Integer | **0** to **65,535**                     |
| 32bit_integer          | 32 Bit Integer          | **-2,147,483,648** to **2,147,483,647** |
| 32bit_unsigned_integer | 32 Bit Unsigned Integer | **0** to **4,294,967,295**              |

### Array Types

| Type Name       | Full Name       | Implementation                               |
| --------------- | --------------- | -------------------------------------------- |
| array           | Array           | `Array.isArray(value)`                       |
| non_empty_array | Non-Empty Array | `Array.isArray(value) && value.length !== 0` |

### Object Types

| Type Name       | Full Name       | Implementation                                                         |
| --------------- | --------------- | ---------------------------------------------------------------------- |
| non_null_object | Non-Null Object | `typeof value === "object" && value !== null`                          |
| plain_object    | Plain Object    | `typeof value === "object" && value !== null && !Array.isArray(value)` |

### String Types

| Type Name                | Full Name                  | Implementation                                       |
| ------------------------ | -------------------------- | ---------------------------------------------------- |
| non_empty_string         | Non-Empty String           | `typeof value === "string" && value !== ""`          |
| trimmed_non_empty_string | Non-Empty String (trimmed) | `typeof value === "string" && !!value.trim().length` |

### Other Types

| Type Name   | Full Name    | Implementation                            |
| ----------- | ------------ | ----------------------------------------- |
| nan         | Not A Number | `Number.isNaN(value)`                     |
| any         | Any          | `true` // returns true for any value      |
| nullish     | Nullish      | `value === null \|\| value === undefined` |
| non_nullish | Non-Nullish  | `value !== null && value !== undefined`   |

If you find any bug or want to improve something please feel free to open an
issue. Pull requests are also welcomed.
