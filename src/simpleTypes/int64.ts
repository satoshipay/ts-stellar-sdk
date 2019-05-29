import { xdr, int64 } from "ts-stellar-xdr";

export type SimpleInt64 = string | number;

export function create(simpleInt64: SimpleInt64): xdr.Int64 {
  if (typeof simpleInt64 === "number") {
    return int64.Signed.fromNumber(simpleInt64);
  }

  return int64.Signed.fromString(simpleInt64);
}

export function createNonnegative(simpleInt64: SimpleInt64): xdr.Int64 {
  if (typeof simpleInt64 === "number") {
    if (simpleInt64 < 0) {
      throw new Error(`Amount must be >= 0`);
    }
    return int64.Signed.fromNumber(simpleInt64);
  }

  const integer = int64.Signed.fromString(simpleInt64);
  if (!integer.isNonNegative()) {
    throw new Error(`Amount must be >= 0`);
  }
  return integer;
}

export function createPositive(simpleInt64: SimpleInt64): xdr.Int64 {
  if (typeof simpleInt64 === "number") {
    if (simpleInt64 <= 0) {
      throw new Error(`Amount must be > 0`);
    }
    return int64.Signed.fromNumber(simpleInt64);
  }

  const integer = int64.Signed.fromString(simpleInt64);
  if (!integer.isPositive()) {
    throw new Error(`Amount must be > 0`);
  }
  return integer;
}

export function simplify(integer: xdr.Int64): SimpleInt64 {
  try {
    return integer.toNumber();
  } catch (_) {
    return integer.toString();
  }
}
