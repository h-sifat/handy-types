import parseSchema, { SchemaDefinition } from "./schema-parser";
import validate from "./schemawise-validator";
import { handyTypes } from "./types";

interface ErrorInformation {
  name?: string;
  message?: string;
  code?: string | number;
  otherInfo?: object;
}

export default function assert<Type>(
  schema: string,
  value: unknown,
  errorInfo: ErrorInformation = {}
): asserts value is Type {
  const schemaDefinition = parseSchema(schema);
  const isValid = validate({ schema: schemaDefinition, value });

  if (!isValid) throw generateError({ schemaDefinition, errorInfo });
}

interface GenerateErrorArgument {
  schemaDefinition: SchemaDefinition;
  errorInfo: ErrorInformation;
}

export function generateError(arg: GenerateErrorArgument): Error {
  const { schemaDefinition, errorInfo } = arg;

  const errorMessage =
    "message" in errorInfo
      ? (errorInfo.message as string)
      : generateErrorMessage({
          valueName: errorInfo.name!,
          schemaName: schemaDefinition.schemaName,
        });

  const error = new Error(errorMessage);

  const { code, otherInfo } = errorInfo;

  // @ts-ignore
  if (code) error.code = code;

  if (otherInfo && handyTypes.plain_object(otherInfo)) {
    const { message, code, ...rest } = otherInfo as any;
    Object.assign(error, rest);
  }

  return error;
}

interface GenerateErrorMessageArgument {
  schemaName: string;
  valueName?: string;
}
export function generateErrorMessage(
  arg: GenerateErrorMessageArgument
): string {
  const { schemaName, valueName } = arg;
  return `${valueName || "Value"} must be of type: ${schemaName}`;
}
