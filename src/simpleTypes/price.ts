import { xdr } from "ts-stellar-xdr";

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

export function create(simplePrice: SimplePrice): xdr.Price {
  if (typeof simplePrice === "object") {
    if (isInvalidPositiveNumber(simplePrice.n) || isInvalidPositiveNumber(simplePrice.d)) {
      throw new Error(`Number must be between 0 (exclusive) and ${MAX_INT32}`);
    }
    return simplePrice;
  }

  if (isInvalidPositiveNumber(simplePrice)) {
    throw new Error(`Number must be between 0 (exclusive) and ${MAX_INT32}`);
  }

  return approximateAsFraction(simplePrice);
}

export function simplify(price: xdr.Price): SimplePrice {
  if (price.d === 0) {
    return price;
  }

  return price.n / price.d;
}
