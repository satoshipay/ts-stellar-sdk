import { int64 } from "ts-stellar-xdr";

export interface TransactionSource {
  sourceAccount: string;
  sequenceNumber: int64.Signed;
}

export function incrementSequenceNumber(source: TransactionSource, increment?: number) {
  if (increment !== undefined && increment <= 0) {
    throw new Error("Sequence number can only be incremented by a positive amount");
  }

  source.sequenceNumber.add(increment !== undefined ? increment : 1);
}
