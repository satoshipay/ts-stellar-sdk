import { xdr, int64 } from "ts-stellar-xdr";

import { sha256 } from "./utils/sha256.node";
import { fromBinary, toBinary } from "./utils/base64.node";
import * as operation from "./operation";
import * as accountId from "./simpleTypes/accountId";
import * as timeBounds from "./simpleTypes/timeBounds";
import * as memo from "./simpleTypes/memo";
import { Keypair, PublicKey } from "./keypair";
import { Network } from "./network";
import { BASE_FEE } from "./config/config";
import { hexToBinary } from "./utils/hex";
import { TransactionSource, incrementSequenceNumber } from "./account";

const MAX_INT32 = 0x7fffffff;

export interface SimpleTransactionWithSource {
  fee?: number;
  timeBounds?: timeBounds.SimpleTimeBounds;
  memo?: memo.SimpleMemo;
  operations: Array<operation.SimpleOperation>;
}

export type SimpleTransaction = SimpleTransactionWithSource & TransactionSource;

export function createFromSourceAccount(simpleTransaction: SimpleTransactionWithSource, source: TransactionSource) {
  incrementSequenceNumber(source);
  return create(Object.assign({}, simpleTransaction, source));
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
    typeof simpleTransaction.sequenceNumber === "number"
      ? int64.Signed.fromNumber(simpleTransaction.sequenceNumber)
      : simpleTransaction.sequenceNumber;

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
    sequenceNumber: transaction.seqNum,
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

export async function sign(transactionEnvelope: xdr.TransactionEnvelope, network: Network, ...keypairs: Keypair[]) {
  const transactionHash = await getHash(transactionEnvelope.tx, network);

  await Promise.all(
    keypairs.map(async keypair => {
      transactionEnvelope.signatures.push({
        hint: keypair.getSignatureHint(),
        signature: await keypair.createSignature(transactionHash)
      });
    })
  );
}

export async function signHashX(transactionEnvelope: xdr.TransactionEnvelope, preImage: ArrayBuffer | string) {
  const binaryPreImage = typeof preImage === "string" ? hexToBinary(preImage) : preImage;

  if (binaryPreImage.byteLength > 64) {
    throw new Error("Preimage must not be longer than 64 bytes");
  }

  const hash = await sha256(binaryPreImage);
  const signatureHint = hash.slice(hash.byteLength - 4);

  transactionEnvelope.signatures.push({
    hint: signatureHint,
    signature: binaryPreImage
  });
}

export async function createSignature(
  transaction: xdr.Transaction,
  network: Network,
  keypair: Keypair
): Promise<string> {
  const signature = await keypair.createSignature(await getHash(transaction, network));
  return fromBinary(signature);
}

export async function addSignature(
  transactionEnvelope: xdr.TransactionEnvelope,
  network: Network,
  signatureBase64: string,
  publicKey: PublicKey
) {
  const signature = toBinary(signatureBase64);
  const transactionHash = await getHash(transactionEnvelope.tx, network);
  if (!publicKey.verifySignature(transactionHash, signature)) {
    throw new Error("Invalid signature");
  }

  transactionEnvelope.signatures.push({
    hint: publicKey.getSignatureHint(),
    signature
  });
}

export async function getHash(transaction: xdr.Transaction, network: Network): Promise<ArrayBuffer> {
  const networkId = network.id;
  const envelopeType = xdr.EnvelopeType.toXdr("envelopeTypeTx");
  const transactionXdr = xdr.Transaction.toXdr(transaction);

  const result = new Uint8Array(networkId.byteLength + envelopeType.byteLength + transactionXdr.byteLength);
  result.set(new Uint8Array(networkId));
  result.set(new Uint8Array(envelopeType), networkId.byteLength);
  result.set(new Uint8Array(transactionXdr), networkId.byteLength + envelopeType.byteLength);

  return sha256(result);
}
