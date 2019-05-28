import { xdr, int64 } from "ts-stellar-xdr";

import { createOperation, SimpleOperation, simplifyOperation } from "./operation";
import { createAccountId, simplifyAccountId } from "./simpleTypes/accountId";
import { SimpleTimeBounds, createTimeBounds, simplifyTimeBounds } from "./simpleTypes/timeBounds";
import { createMemo, simplifyMemo, SimpleMemo } from "./simpleTypes/memo";

const BASE_FEE = 100;
const MAX_INT32 = 0x7fffffff;

export interface SimpleTransaction {
  sourceAccount: string;
  fee?: number;
  seqNum: int64.Signed;
  timeBounds?: SimpleTimeBounds;
  memo?: SimpleMemo;
  operations: Array<SimpleOperation>;
}

export function createTransaction(simpleTransaction: SimpleTransaction): xdr.Transaction {
  if (typeof simpleTransaction.fee === "number") {
    if (
      simpleTransaction.fee < 0 ||
      simpleTransaction.fee > MAX_INT32 ||
      isNaN(simpleTransaction.fee) ||
      !isFinite(simpleTransaction.fee)
    ) {
      throw new Error(`Transaction fee must be between ${0} and ${MAX_INT32}`);
    }
  }

  const sourceAccount = createAccountId(simpleTransaction.sourceAccount);
  const fee = simpleTransaction.fee || BASE_FEE;
  const seqNum =
    typeof simpleTransaction.seqNum === "number"
      ? int64.Signed.fromNumber(simpleTransaction.seqNum)
      : simpleTransaction.seqNum;
  const timeBounds = simpleTransaction.timeBounds && createTimeBounds(simpleTransaction.timeBounds);
  const memo = createMemo(simpleTransaction.memo);
  const operations = simpleTransaction.operations.map(createOperation);

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

export function simplifyTransaction(transaction: xdr.Transaction): SimpleTransaction {
  return {
    sourceAccount: simplifyAccountId(transaction.sourceAccount),
    fee: transaction.fee,
    seqNum: transaction.seqNum,
    ...(transaction.timeBounds ? { timeBounds: simplifyTimeBounds(transaction.timeBounds) } : null),
    ...(transaction.memo ? { memo: simplifyMemo(transaction.memo) } : null),
    operations: transaction.operations.map(simplifyOperation)
  };
}
