import sha256 from "fast-sha256";
import { xdr, int64 } from "ts-stellar-xdr";
import base64 from "base64-js";

import { createOperation, SimpleOperation, simplifyOperation } from "./operation";
import { createAccountId, simplifyAccountId } from "./simpleTypes/accountId";
import { SimpleTimeBounds, createTimeBounds, simplifyTimeBounds } from "./simpleTypes/timeBounds";
import { createMemo, simplifyMemo, SimpleMemo } from "./simpleTypes/memo";
import {
  Keypair,
  getSignatureHint,
  createSignature as createRawSignature,
  HalfKeypair,
  verifySignature
} from "./keypair";
import { Network, getNetworkId } from "./network";

export const BASE_FEE = 100;
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

export function createTransactionEnvelope(simpleTransaction: SimpleTransaction): xdr.TransactionEnvelope {
  return {
    tx: createTransaction(simpleTransaction),
    signatures: []
  };
}

export function sign(transactionEnvelope: xdr.TransactionEnvelope, network: Network, ...keypairs: Keypair[]) {
  const transactionHash = getHash(transactionEnvelope.tx, network);

  keypairs.forEach(keypair => {
    transactionEnvelope.signatures.push({
      hint: getSignatureHint(keypair),
      signature: createRawSignature(keypair, transactionHash)
    });
  });
}

export function createSignature(transaction: xdr.Transaction, network: Network, keypair: Keypair): string {
  const signature = createRawSignature(keypair, getHash(transaction, network));
  return base64.fromByteArray(new Uint8Array(signature));
}

export function addSignature(
  transactionEnvelope: xdr.TransactionEnvelope,
  network: Network,
  signatureBase64: string,
  halfKeypair: HalfKeypair
) {
  const signature = base64.toByteArray(signatureBase64).buffer;
  const transactionHash = getHash(transactionEnvelope.tx, network);
  if (!verifySignature(halfKeypair, transactionHash, signature)) {
    throw new Error("Invalid signature");
  }

  transactionEnvelope.signatures.push({
    hint: getSignatureHint(halfKeypair),
    signature
  });
}

export function getHash(transaction: xdr.Transaction, network: Network): ArrayBuffer {
  const networkId = getNetworkId(network);
  const envelopeType = xdr.EnvelopeType.toXdr("envelopeTypeTx");
  const transactionXdr = xdr.Transaction.toXdr(transaction);

  const result = new Uint8Array(networkId.byteLength + envelopeType.byteLength + transactionXdr.byteLength);
  result.set(new Uint8Array(networkId));
  result.set(new Uint8Array(envelopeType), networkId.byteLength);
  result.set(new Uint8Array(transactionXdr), networkId.byteLength + envelopeType.byteLength);

  return sha256(result).buffer;
}
