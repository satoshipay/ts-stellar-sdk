import { Int64 } from "ts-stellar-xdr";
import utils from "ts-stellar-xdr/lib/utils";

export type SimpleInt64 = string | number | utils.Int64;

export function createInt64(value: SimpleInt64): Int64 {
  if (typeof value === "number") {
    if (value < Number.MIN_SAFE_INTEGER || value > Number.MAX_SAFE_INTEGER || !isFinite(value) || isNaN(value)) {
      throw new Error(`Amount must be >= ${Number.MIN_SAFE_INTEGER} and <= ${Number.MAX_SAFE_INTEGER}`);
    }
    return utils.Int64.fromNumber(value);
  }

  if (typeof value === "string") {
    const array = toBaseOut(value, 10, 0x100000000);
    value = new utils.Int64(array[1], array[0]);
  }

  return value;
}

export function createNonNegativeInt64(value: SimpleInt64): Int64 {
  if (typeof value === "number") {
    if (value < 0 || value > Number.MAX_SAFE_INTEGER || !isFinite(value) || isNaN(value)) {
      throw new Error(`Amount must be >= 0 and <= ${Number.MAX_SAFE_INTEGER}`);
    }
    return utils.Int64.fromNumber(value);
  }

  if (typeof value === "string") {
    const array = toBaseOut(value, 10, 0x100000000);
    value = new utils.Int64(array[1], array[0]);
  }

  if (!value.isNonNegative()) {
    throw new Error(`Amount must be >= 0`);
  }

  return value;
}

export function createPositiveInt64(value: SimpleInt64): Int64 {
  if (typeof value === "number") {
    if (value <= 0 || value > Number.MAX_SAFE_INTEGER || !isFinite(value) || isNaN(value)) {
      throw new Error(`Amount must be > 0 and <= ${Number.MAX_SAFE_INTEGER}`);
    }
    return utils.Int64.fromNumber(value);
  }

  if (typeof value === "string") {
    const array = toBaseOut(value, 10, 0x100000000);
    value = new utils.Int64(array[1], array[0]);
  }

  if (!value.isPositive()) {
    throw new Error(`Amount must be > 0`);
  }

  return value;
}

const ALPHABET = "0123456789abcdefghijklmnopqrstuvwxyz";
function toBaseOut(str: string, baseIn: number, baseOut: number) {
  var j,
    arr = [0],
    arrL,
    i = 0,
    len = str.length;

  for (; i < len; ) {
    for (arrL = arr.length; arrL--; arr[arrL] *= baseIn);

    arr[0] += ALPHABET.indexOf(str.charAt(i++));

    for (j = 0; j < arr.length; j++) {
      if (arr[j] > baseOut - 1) {
        if (arr[j + 1] == null) arr[j + 1] = 0;
        arr[j + 1] += (arr[j] / baseOut) | 0;
        arr[j] %= baseOut;
      }
    }
  }

  return arr.reverse();
}
