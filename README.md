# Handy-Types
A small library to check variable types. It consists of many utility functions
like `int`, `positive_int`, `array`, `non_empty_array` and many more. Every
**type**(*function*) has their full name in case you want to write a meaningful
error message. The library is fully tested so it has **100%** test coverage. It
uses the **UMD** module system so it supports every JavaScript environment that
uses any kind JavaScript of module system.

## Example

```javascript
const { types, typeNames } = require("handy-types");
// Or: import { types, typeNames } from "handy-types";

const user = {};

if(!types.ne_object(obj)) // or use the long form: types.non_empty_object(obj)
  throw new Error(`"user" must be of type "${typeNames.ne_object}"`);
```
All the available types are listed below.

## Number Types
Type | Full Name | Alias
---- | -------- | -----
number | Number | num
finite_num | Finite Number
positive_number | Positive Number | p_number 
negative_number | Negative Number | n_number 

## Integer Types
Type | Full Name | Alias
---- | -------- | -----
integer | Integer | int
safe_int | Safe Integer
odd | Odd Number
even | Even Number
natural_num | Natural Number
positive_int | Positive Integer | p_int 
negative_int | Negative Integer | n_int 

__Note:__  For `even` and `odd` type you must pass an __integer__ to them
otherwise you may get wrong result in the following case.
```js
const num = 4.32;

if(types.even(num)) {
  // num is even
} else {
  // But here num is not necessarily odd
}
```
So if we can make sure that _num_ is an integer then we'll get predicted results.
```js
const num = 4.32;

if(types.int(num)) {
  if(types.even(num)) {
    // num is even
  } else {
    // num is odd
  }
}
```

## Primitive Integer
Type | Full Name | Range
---- | -------- | -----
int8 | 8 Bit Integer | **-128** to **127**
uint8 | 8 Bit Unsigned Integer | **0** to **255**
int16 | 16 Bit Integer | **-32,768** to **32,767** 
uint16 | 16 Bit Unsigned Integer | **0** to **65,535**
int32 | 32 Bit Integer | **-2,147,483,648** to **2,147,483,647**
uint32 | 32 Bit Unsigned Integer | **0** to **4,294,967,295**

## String Types
Type | Full Name | Alias
---- | -------- | -----
string | String
empty_string | Empty String | es 
non_empty_string | Non-Empty String | ne_string 


## Object Types
Type | Full Name | Alias
---- | -------- | -----
object | Object
empty_object | Empty Object | eo 
non_null_object | Non-Null Object | nn_object 
non_empty_object | Non-Empty Object | ne_object 


## Array Types
Type | Full Name | Alias
---- | -------- | -----
array | Array
empty_array | Empty Array | ea 
non_empty_array | Non-Empty Array | ne_array 


## Global Objects
Type | Full Name | Alias
---- | -------- | -----
regex | Regular Expression
date | Date
set | Set
map | Map


## Function Type
Type | Full Name | Alias
---- | -------- | -----
function | Function


## Symbol Type
Type | Full Name | Alias
---- | -------- | -----
symbol | Symbol


## Boolean Type
Type | Full Name | Alias
---- | -------- | -----
boolean | Boolean
truthy | Truthy
falsy | Falsy

## Constants
Type | Full Name | Alias
---- | -------- | -----
true | True
false | False
undefined | Undefined
null | Null
NaN | Not A Number

## Other Types
Type | Full Name | Alias
---- | -------- | -----
defined | Defined
any | Any
nullish | Nullish

If you find a bug or want to add a new type feel free to make a pull
request :)
