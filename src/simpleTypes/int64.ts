import { Int64, Integer64 } from "ts-stellar-xdr";

export type SimpleInt64 = string | number;

export function createInt64(value: SimpleInt64): Int64 {
  if (typeof value === "number") {
    return Integer64.fromNumber(value);
  }

  return Integer64.fromString(value);
}

export function createNonNegativeInt64(value: SimpleInt64): Int64 {
  if (typeof value === "number") {
    if (value < 0) {
      throw new Error(`Amount must be >= 0`);
    }
    return Integer64.fromNumber(value);
  }

  const integer = Integer64.fromString(value);
  if (!integer.isNonNegative()) {
    throw new Error(`Amount must be >= 0`);
  }
  return integer;
}

export function createPositiveInt64(value: SimpleInt64): Int64 {
  if (typeof value === "number") {
    if (value <= 0) {
      throw new Error(`Amount must be > 0`);
    }
    return Integer64.fromNumber(value);
  }

  const integer = Integer64.fromString(value);
  if (!integer.isPositive()) {
    throw new Error(`Amount must be > 0`);
  }
  return integer;
}
