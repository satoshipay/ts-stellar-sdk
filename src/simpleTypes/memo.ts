import { xdr, int64 } from "ts-stellar-xdr";
import { string } from "ts-stellar-xdr/lib/converters";

import { hexToBinary, binaryToHex } from "../utils/hex";

export type SimpleMemo = undefined | string | number | { type: "hash" | "return"; value: string };

const memoTextConverter = string(28);

export function create(simpleMemo: SimpleMemo): xdr.Memo {
  if (simpleMemo) {
    if (typeof simpleMemo === "string") {
      if (!memoTextConverter.isValid(simpleMemo)) {
        throw new Error(`memo text invalid or too long – only 28 bytes allowed`);
      }

      return { type: "memoText", value: simpleMemo };
    }

    if (typeof simpleMemo === "number") {
      return { type: "memoId", value: int64.Unsigned.fromNumber(simpleMemo) };
    }

    const binaryValue = hexToBinary(simpleMemo.value);
    if (binaryValue.byteLength !== 32) {
      throw new Error(`Length of memo value must be 32 (is ${binaryValue.byteLength})`);
    }

    switch (simpleMemo.type) {
      case "hash":
        return {
          type: "memoHash",
          value: binaryValue
        };
      case "return":
        return {
          type: "memoReturn",
          value: binaryValue
        };
      default:
        throw new Error(`Memo type ${simpleMemo.type} invalid`);
    }
  } else {
    return { type: "memoNone" };
  }
}

export function simplify(memo: xdr.Memo): SimpleMemo {
  switch (memo.type) {
    case "memoNone":
      return undefined;
    case "memoId":
      return memo.value.toNumber();
    case "memoText":
      return memo.value;
    case "memoHash":
      return { type: "hash", value: binaryToHex(memo.value) };
    case "memoReturn":
      return { type: "return", value: binaryToHex(memo.value) };
  }
}
