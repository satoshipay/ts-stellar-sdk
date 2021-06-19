import { xdr, int64 } from "ts-stellar-xdr";

import { sha256 } from "./utils/sha.node";
import { fromBinary, toBinary } from "./utils/base64.node";
import * as operation from "./operation";
import * as muxedAccount from "./simpleTypes/muxedAccount";
import * as timeBounds from "./simpleTypes/timeBounds";
import * as memo from "./simpleTypes/memo";
import { Keypair, PublicKey } from "./keypair";
import { Network } from "./network";
import { BASE_FEE } from "./config/config";
import { hexToBinary } from "./utils/hex";
import { TransactionSource, incrementSequenceNumber } from "./account";

const MAX_INT32 = 0x7fffffff;

export interface SimpleTransactionWithoutSource {
  fee?: number;
  timeBounds?: timeBounds.SimpleTimeBounds;
  memo?: memo.SimpleMemo;
  operations: Array<operation.SimpleOperation>;
}

export type SimpleTransaction = SimpleTransactionWithoutSource & TransactionSource;

export function createFromSourceAccount(simpleTransaction: SimpleTransactionWithoutSource, source: TransactionSource) {
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
    sourceAccount: muxedAccount.create(simpleTransaction.sourceAccount),
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
    sourceAccount: muxedAccount.simplify(transaction.sourceAccount),
    fee: transaction.fee,
    sequenceNumber: transaction.seqNum,
    timeBounds: transaction.timeBounds && timeBounds.simplify(transaction.timeBounds),
    memo: memo.simplify(transaction.memo),
    operations: transaction.operations.map(operation.simplify)
  };
}

export function createTransactionEnvelope(simpleTransaction: SimpleTransaction): xdr.TransactionEnvelope {
  return {
    type: "envelopeTypeTx",
    value: {
      tx: create(simpleTransaction),
      signatures: []
    }
  };
}

export async function sign(transactionEnvelope: xdr.TransactionEnvelope, network: Network, ...keypairs: Keypair[]) {
  const transactionHash = await getHash(transactionEnvelope, network);

  await Promise.all(
    keypairs.map(async keypair => {
      transactionEnvelope.value.signatures.push({
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

  transactionEnvelope.value.signatures.push({
    hint: signatureHint,
    signature: binaryPreImage
  });
}

export async function createSignature(
  transactionEnvelope: xdr.TransactionEnvelope,
  network: Network,
  keypair: Keypair
): Promise<string> {
  const signature = await keypair.createSignature(await getHash(transactionEnvelope, network));
  return fromBinary(signature);
}

export async function addSignature(
  transactionEnvelope: xdr.TransactionEnvelope,
  network: Network,
  signatureBase64: string,
  publicKey: PublicKey
) {
  const signature = toBinary(signatureBase64);
  const transactionHash = await getHash(transactionEnvelope, network);
  if (!publicKey.verifySignature(transactionHash, signature)) {
    throw new Error("Invalid signature");
  }

  transactionEnvelope.value.signatures.push({
    hint: publicKey.getSignatureHint(),
    signature
  });
}

function constructTaggedTransaction(
  transactionEnvelope: xdr.TransactionEnvelope
): xdr.TransactionSignaturePayloadTaggedTransaction {
  switch (transactionEnvelope.type) {
    case "envelopeTypeTxV0":
      const { sourceAccountEd25519, fee, seqNum, timeBounds, memo, operations } = transactionEnvelope.value.tx;
      transactionEnvelope = {
        type: "envelopeTypeTx",
        value: {
          tx: {
            sourceAccount: {
              type: "keyTypeEd25519",
              value: sourceAccountEd25519
            },
            fee,
            seqNum,
            timeBounds,
            memo,
            operations,
            ext: { type: 0 }
          },
          signatures: transactionEnvelope.value.signatures
        }
      };

    case "envelopeTypeTx":
      return {
        type: "envelopeTypeTx",
        value: transactionEnvelope.value.tx
      };

    case "envelopeTypeTxFeeBump":
      return {
        type: "envelopeTypeTxFeeBump",
        value: transactionEnvelope.value.tx
      };
  }
}

export async function getHash(transactionEnvelope: xdr.TransactionEnvelope, network: Network): Promise<ArrayBuffer> {
  const signaturePayload = xdr.TransactionSignaturePayload.toXdr({
    networkId: network.id,
    taggedTransaction: constructTaggedTransaction(transactionEnvelope)
  });

  return sha256(signaturePayload);
}
