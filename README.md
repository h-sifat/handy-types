# Handy-Types
A small library to check variable types. It consists of many utility functions
like `int`, `positive_int`, `array`, `non_empty_array` and many more. Every
**type**(*function*) has their fullname in case you want to write a meaningful
error message. The library is fully tested so it has **100%** test coverage. It
uses the **UMD** module system so it supports every javascript environment.

## Example

```javascript
const { types, typeNames } = require("handy-types");
// Or: import { types, typeNames } from "handy-types";

const user = {};

if(!types.ne_object(obj)) // or use the fullname: types.non_empty_object(obj)
  throw new Error(`"user" must be of type "${typeNames.ne_object}"`);
```
All the available types are listed below.

## Number Types
Type | Fullname | Alias
---- | -------- | -----
NaN | Not A Number
number | Number
finite_num | Finite Number
positive_number | Positive Number | p_number 
negative_number | Negative Number | n_number 

## Integer Types
Type | Fullname | Alias
---- | -------- | -----
int | Integer
safe_int | Safe Integer
odd | Odd Number
even | Even Number
natural_num | Natural Number
positive_int | Positive Integer | p_int 
negative_int | Negative Integer | n_int 


## String Types
Type | Fullname | Alias
---- | -------- | -----
string | String
empty_string | Empty String | es 
non_empty_string | Non-Empty String | ne_string 


## Object Types
Type | Fullname | Alias
---- | -------- | -----
null | Null
object | Object
empty_object | Empty Object | eo 
non_null_object | Non-Null Object | nn_object 
non_empty_object | Non-Empty Object | ne_object 


## Array Types
Type | Fullname | Alias
---- | -------- | -----
array | Array
empty_array | Empty Array | ea 
non_empty_array | Non-Empty Array | ne_array 


## Global Objects
Type | Fullname | Alias
---- | -------- | -----
regex | Regular Expression
date | Date
set | Set
map | Map


## Function Type
Type | Fullname | Alias
---- | -------- | -----
function | Function


## Symbol Type
Type | Fullname | Alias
---- | -------- | -----
symbol | Symbol


## Boolean Type
Type | Fullname | Alias
---- | -------- | -----
boolean | Boolean
true | True
false | False
truthy | Truthy
falsy | Falsy


## Other Types
Type | Fullname | Alias
---- | -------- | -----
undefined | Undefined
defined | Defined
any | Any

If you find any bug or want to add a new type feel free to make a pull request.
