import { Memo } from "ts-stellar-xdr";
import { Uint64 } from "ts-stellar-xdr/lib/utils";
import { string } from "ts-stellar-xdr/lib/converters";

export type SimpleMemo = string | number | undefined;

const memoTextConverter = string(28);

export function createMemo(simpleMemo: SimpleMemo): Memo {
  if (simpleMemo) {
    if (typeof simpleMemo === "string") {
      if (!memoTextConverter.isValid(simpleMemo)) {
        throw new Error(`memo text invalid or too long – only 28 bytes allowed`);
      }
      return { type: "memoText", value: simpleMemo };
    } else {
      return { type: "memoId", value: Uint64.fromNumber(simpleMemo) };
    }
  } else {
    return { type: "memoNone" };
  }
}
