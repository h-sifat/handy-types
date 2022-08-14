import { handyTypes, AllHandyTypes } from "./index";

export class EPP extends Error {
  constructor(message: string, public code: string) {
    super(message);
  }
}

export function assertValidHandyType(
  type: string
): asserts type is AllHandyTypes {
  if (!(type in handyTypes))
    throw new EPP(`Invalid handy type: "${type}"`, "INVALID_HANDY_TYPE");
}
