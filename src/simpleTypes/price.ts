import { Price } from "ts-stellar-xdr";

import { MAX_INT32, approximateAsFraction } from "../utils/fractions";

export type SimplePrice =
  | number
  | {
      n: number;
      d: number;
    };

function isInvalidPositiveNumber(number: number) {
  return number <= 0 || number > MAX_INT32 || !isFinite(number) || isNaN(number);
}

export function createPrice(price: SimplePrice): Price {
  if (typeof price === "object") {
    if (isInvalidPositiveNumber(price.n) || isInvalidPositiveNumber(price.d)) {
      throw new Error(`Number must be between 0 (exclusive) and ${MAX_INT32}`);
    }
    return price;
  }

  if (isInvalidPositiveNumber(price)) {
    throw new Error(`Number must be between 0 (exclusive) and ${MAX_INT32}`);
  }

  return approximateAsFraction(price);
}
