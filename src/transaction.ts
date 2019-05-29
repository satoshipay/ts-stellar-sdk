import sha256 from "fast-sha256";
import { xdr, int64 } from "ts-stellar-xdr";
import base64 from "base64-js";

import * as operation from "./operation";
import * as accountId from "./simpleTypes/accountId";
import * as timeBounds from "./simpleTypes/timeBounds";
import * as memo from "./simpleTypes/memo";
import {
  Keypair,
  getSignatureHint,
  createSignature as createRawSignature,
  HalfKeypair,
  verifySignature
} from "./keypair";
import { Network, getNetworkId } from "./network";
import { BASE_FEE } from "./config/config";

const MAX_INT32 = 0x7fffffff;

export interface SimpleTransaction {
  sourceAccount: string;
  fee?: number;
  seqNum: int64.Signed;
  timeBounds?: timeBounds.SimpleTimeBounds;
  memo?: memo.SimpleMemo;
  operations: Array<operation.SimpleOperation>;
}

export function create(simpleTransaction: SimpleTransaction): xdr.Transaction {
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

  const seqNum =
    typeof simpleTransaction.seqNum === "number"
      ? int64.Signed.fromNumber(simpleTransaction.seqNum)
      : simpleTransaction.seqNum;

  return {
    sourceAccount: accountId.create(simpleTransaction.sourceAccount),
    fee: simpleTransaction.fee || BASE_FEE,
    seqNum,
    timeBounds: simpleTransaction.timeBounds && timeBounds.create(simpleTransaction.timeBounds),
    memo: memo.create(simpleTransaction.memo),
    operations: simpleTransaction.operations.map(operation.create),
    ext: { type: 0 }
  };
}

export function simplify(transaction: xdr.Transaction): SimpleTransaction {
  return {
    sourceAccount: accountId.simplify(transaction.sourceAccount),
    fee: transaction.fee,
    seqNum: transaction.seqNum,
    timeBounds: transaction.timeBounds && timeBounds.simplify(transaction.timeBounds),
    memo: memo.simplify(transaction.memo),
    operations: transaction.operations.map(operation.simplify)
  };
}

export function createTransactionEnvelope(simpleTransaction: SimpleTransaction): xdr.TransactionEnvelope {
  return {
    tx: create(simpleTransaction),
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
