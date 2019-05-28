import { xdr, int64 } from "ts-stellar-xdr";

export type SimpleInt64 = string | number;

export function createInt64(value: SimpleInt64): xdr.Int64 {
  if (typeof value === "number") {
    return int64.Signed.fromNumber(value);
  }

  return int64.Signed.fromString(value);
}

export function createNonNegativeInt64(value: SimpleInt64): xdr.Int64 {
  if (typeof value === "number") {
    if (value < 0) {
      throw new Error(`Amount must be >= 0`);
    }
    return int64.Signed.fromNumber(value);
  }

  const integer = int64.Signed.fromString(value);
  if (!integer.isNonNegative()) {
    throw new Error(`Amount must be >= 0`);
  }
  return integer;
}

export function createPositiveInt64(value: SimpleInt64): xdr.Int64 {
  if (typeof value === "number") {
    if (value <= 0) {
      throw new Error(`Amount must be > 0`);
    }
    return int64.Signed.fromNumber(value);
  }

  const integer = int64.Signed.fromString(value);
  if (!integer.isPositive()) {
    throw new Error(`Amount must be > 0`);
  }
  return integer;
}
