import { int64 } from "ts-stellar-xdr";

import * as muxedAccount from "./simpleTypes/muxedAccount";

export interface TransactionSource {
  sourceAccount: muxedAccount.SimpleMuxedAccount;
  sequenceNumber: int64.Signed;
}

export function incrementSequenceNumber(source: TransactionSource, increment?: number) {
  if (increment !== undefined && increment <= 0) {
    throw new Error("Sequence number can only be incremented by a positive amount");
  }

  source.sequenceNumber.add(increment !== undefined ? increment : 1);
}
