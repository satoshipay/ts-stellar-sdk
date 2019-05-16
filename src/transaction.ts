import { Memo, Transaction, PublicKey, Operation, OperationBody, Asset, AllowTrustOpAsset } from "ts-stellar-xdr";

import { decode } from "./base32";
import { convertStringToUtf8 } from "./utils/utf8";

const BASE_FEE = 100;

export interface SimpleTransaction {
  sourceAccount: string;
  fee?: number;
  seqNum: number;
  timeBounds?: {
    minTime?: Date | number;
    maxTime?: Date | number;
  };
  memo?: string | number;
  operations: Array<SimpleOperation>;
}

export function createTransaction(transaction: SimpleTransaction): Transaction {
  const sourceAccount = createPublicKey(transaction.sourceAccount);
  const fee = transaction.fee || BASE_FEE;
  const seqNum = transaction.seqNum;

  let timeBounds = undefined;
  if (transaction.timeBounds) {
    const minTime = transaction.timeBounds.minTime;
    const maxTime = transaction.timeBounds.maxTime;

    timeBounds = {
      minTime: minTime ? (typeof minTime === "number" ? minTime : minTime.getTime() / 1000) : 0,
      maxTime: maxTime ? (typeof maxTime === "number" ? maxTime : maxTime.getTime() / 1000) : 0
    };
  }

  let memo: Memo = { type: "memoNone" };
  if (transaction.memo) {
    if (typeof transaction.memo === "string") {
      memo = { type: "memoText", value: transaction.memo };
    } else {
      memo = { type: "memoId", value: transaction.memo };
    }
  }

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

export function createPublicKey(simplePublicKey: string): PublicKey {
  return {
    type: "publicKeyTypeEd25519",
    value: decode("ed25519PublicKey", simplePublicKey)
  };
}

export function createOperation(simpleOperation: SimpleOperation): Operation {
  let operationBody: OperationBody;
  switch (simpleOperation.type) {
    case "createAccount":
      operationBody = {
        type: "createAccount",
        value: {
          destination: createPublicKey(simpleOperation.destination),
          startingBalance: simpleOperation.startingBalance
        }
      };
      break;

    case "payment":
      operationBody = {
        type: "payment",
        value: {
          destination: createPublicKey(simpleOperation.destination),
          asset,
          amount: simpleOperation.amount
        }
      };
      break;

    case "pathPayment":
    case "manageSellOffer":
    case "createPassiveSellOffer":
    case "setOption":
    case "changeTrust":
    case "allowTrust":
    case "accountMerge":
    case "inflation":
    case "manageDatum":
    case "bumpSequence":
    case "manageBuyOffer":
  }
}

export type SimpleOperation =
  | SimpleCreateAccountOp
  | SimplePaymentOp
  | SimplePathPaymentOp
  | SimpleManageSellOfferOp
  | SimpleCreatePassiveSellOfferOp
  | SimpleSetOptionsOp
  | SimpleChangeTrustOp
  | SimpleAllowTrustOp
  | SimpleAccountMergeOp
  | SimpleInflationOp
  | SimpleManageDataOp
  | SimpleBumpSequenceOp
  | SimpleManageBuyOfferOp;

export interface SimpleCreateAccountOp {
  type: "createAccount";
  sourceAccount?: string;
  destination: string;
  startingBalance: number;
}

export interface SimplePaymentOp {
  type: "payment";
  sourceAccount?: string;
  destination: string;
  asset: SimpleAsset;
  amount: number;
}

export interface SimplePathPaymentOp {
  type: "pathPayment";
  sourceAccount?: string;
  sendAsset: SimpleAsset;
  sendMax: number;
  destination: string;
  destAsset: SimpleAsset;
  destAmount: number;
  path: SimpleAsset[];
}

export interface SimpleManageSellOfferOp {
  type: "manageSellOffer";
  sourceAccount?: string;
  selling: SimpleAsset;
  buying: SimpleAsset;
  amount: number;
  price: SimplePrice;
  offerId: number;
}

export interface SimpleCreatePassiveSellOfferOp {
  type: "createPassiveSellOffer";
  sourceAccount?: string;
  selling: SimpleAsset;
  buying: SimpleAsset;
  amount: number;
  price: SimplePrice;
}

export interface SimpleSetOptionsOp {
  type: "setOption";
  sourceAccount?: string;
  inflationDest?: string;
  clearFlags?: number;
  setFlags?: number;
  masterWeight?: number;
  lowThreshold?: number;
  medThreshold?: number;
  highThreshold?: number;
  homeDomain?: string;
  signer?: SimpleSigner;
}

export interface SimpleChangeTrustOp {
  type: "changeTrust";
  sourceAccount?: string;
  line: SimpleAsset;
  limit: number;
}

export interface SimpleAllowTrustOp {
  type: "allowTrust";
  sourceAccount?: string;
  trustor: string;
  asset: SimpleNonNativeAsset;
  authorize: boolean;
}

export interface SimpleAccountMergeOp {
  type: "accountMerge";
  sourceAccount?: string;
  destinationAccount: string;
}

export interface SimpleInflationOp {
  type: "inflation";
  sourceAccount?: string;
}

export interface SimpleManageDataOp {
  type: "manageDatum";
  sourceAccount?: string;
  dataName: string;
  dataValue?: ArrayBuffer;
}

export interface SimpleBumpSequenceOp {
  type: "bumpSequence";
  sourceAccount?: string;
  bumpTo: number;
}

export interface SimpleManageBuyOfferOp {
  type: "manageBuyOffer";
  sourceAccount?: string;
  selling: SimpleAsset;
  buying: SimpleAsset;
  buyAmount: number;
  price: SimplePrice;
  offerId: number;
}

export function createAsset(simpleAsset: SimpleAsset): Asset {
  if (simpleAsset === "native") {
    return { type: "assetTypeNative" };
  }

  const binaryAssetCode = convertStringToUtf8(simpleAsset.assetCode);
  if (binaryAssetCode.byteLength <= 4) {
    return {
      type: "assetTypeCreditAlphanum4",
      value: { assetCode: simpleAsset.assetCode, issuer: createPublicKey(simpleAsset.issuer) }
    };
  }
}

export function createAllowTrustOpAsset(simpleAllowTrustOpAsset: SimpleNonNativeAsset): AllowTrustOpAsset {}

export type SimpleAsset = "native" | SimpleNonNativeAsset;
export type SimpleNonNativeAsset = { assetCode: string; issuer: string };

export interface SimplePrice {
  n: number;
  d: number;
}

export type SimpleSigner =
  | {
      Ed25519: string;
      weight: number;
    }
  | {
      preAuthTx: string;
      weight: number;
    }
  | {
      hashX: string;
      weight: number;
    };
