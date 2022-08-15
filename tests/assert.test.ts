import assert, { generateError, generateErrorMessage } from "../src/assert";

describe("validation", () => {
  it("does not throw error if value is valid", () => {
    expect(() => {
      assert("string", "a string");
    }).not.toThrow(Error);
  });

  it("throws error if value is invalid", () => {
    expect(() => {
      assert("number", "not a number");
    }).toThrow("Number");
  });
});

describe("generateError", () => {
  const schemaDefinition = Object.freeze({
    schemaType: "basic",
    schemaName: "Number",
    type: "number",
  });
  it.concurrent.each([
    {
      schemaDefinition,
      errorInfo: { message: "_em_" },
      expectedResult: { message: "_em_" },
      case: "should use the user provided message",
    },
    {
      schemaDefinition,
      errorInfo: {},
      expectedResult: {
        message: generateErrorMessage({
          schemaName: schemaDefinition.schemaName,
        }),
      },
      case: "should generate a message if no message is provided",
    },
    {
      schemaDefinition,
      errorInfo: { name: "Age" },
      expectedResult: {
        message: generateErrorMessage({
          schemaName: schemaDefinition.schemaName,
          valueName: "Age",
        }),
      },
      case: "should generate a message with user provided name if no message is provided",
    },
    {
      schemaDefinition,
      errorInfo: { message: "_em_", code: "ec" },
      expectedResult: { message: "_em_", code: "ec" },
      case: "should use the user provided error code",
    },
    {
      schemaDefinition,
      errorInfo: { message: "_em_", otherInfo: { name: "duck" } },
      expectedResult: { message: "_em_", name: "duck" },
      case: "should assign otherErrorInfo to the error if provided",
    },
    {
      schemaDefinition,
      errorInfo: {
        message: "_em_",
        otherInfo: { name: "duck", message: "_new_message_", code: "_code_" },
      },
      expectedResult: { message: "_em_", name: "duck" },
      case: "should assign otherErrorInfo (excluding the message and code prop if present) to the error if provided",
    },
  ])("$case", ({ schemaDefinition, errorInfo, expectedResult }) => {
    // @ts-ignore ignore the type error
    const error = generateError({ schemaDefinition, errorInfo });
    expect(error).toMatchObject(expectedResult);
  });
});
