import { xdr, int64 } from "ts-stellar-xdr";

import { createOperation, SimpleOperation } from "./operation";
import { createAccountId } from "./simpleTypes/accountId";
import { SimpleTimeBounds, createTimeBounds } from "./simpleTypes/timeBounds";
import { createMemo } from "./simpleTypes/memo";

const BASE_FEE = 100;

const MAX_INT32 = 0x7fffffff;

export interface SimpleTransaction {
  sourceAccount: string;
  fee?: number;
  seqNum: number | int64.Signed;
  timeBounds?: SimpleTimeBounds;
  memo?: string | number;
  operations: Array<SimpleOperation>;
}

export function createTransaction(transaction: SimpleTransaction): xdr.Transaction {
  if (typeof transaction.fee === "number") {
    if (transaction.fee < 0 || transaction.fee > MAX_INT32 || isNaN(transaction.fee) || !isFinite(transaction.fee)) {
      throw new Error(`Transaction fee must be between ${0} and ${MAX_INT32}`);
    }
  }

  const sourceAccount = createAccountId(transaction.sourceAccount);
  const fee = transaction.fee || BASE_FEE;
  const seqNum =
    typeof transaction.seqNum === "number" ? int64.Signed.fromNumber(transaction.seqNum) : transaction.seqNum;
  const timeBounds = transaction.timeBounds && createTimeBounds(transaction.timeBounds);
  const memo = createMemo(transaction.memo);
  const operations = transaction.operations.map(createOperation);

  return {
    sourceAccount,
    fee,
    seqNum,
    timeBounds,
    memo,
    operations,
    ext: { type: 0 }
  };
}
