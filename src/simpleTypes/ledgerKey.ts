import { xdr } from "ts-stellar-xdr";

import * as int64 from "./int64";
import * as asset from "./asset";
import * as accountId from "./accountId";
import { hexToBinary, binaryToHex } from "../utils/hex";

export type SimpleLedgerKey =
  | {
      type: "account";
      accountId: string;
    }
  | {
      type: "trustline";
      accountId: string;
      asset: asset.SimpleAsset;
    }
  | {
      type: "offer";
      sellerId: string;
      offerId: int64.SimpleInt64;
    }
  | {
      type: "data";
      accountId: string;
      dataName: string;
    }
  | {
      type: "claimableBalance";
      balanceId: string;
    };

export function create(ledgerEntry: SimpleLedgerKey): xdr.LedgerKey {
  switch (ledgerEntry.type) {
    case "account":
      return {
        type: "account",
        value: {
          accountId: accountId.create(ledgerEntry.accountId)
        }
      };
    case "trustline":
      return {
        type: "trustline",
        value: {
          accountId: accountId.create(ledgerEntry.accountId),
          asset: asset.create(ledgerEntry.asset)
        }
      };
    case "offer":
      return {
        type: "offer",
        value: {
          sellerId: accountId.create(ledgerEntry.sellerId),
          offerId: int64.create(ledgerEntry.offerId)
        }
      };
    case "data":
      if (!xdr.String64.isValid(ledgerEntry.dataName)) {
        throw new Error(`data entry is too long – only 64 bytes allowed`);
      }

      return {
        type: "data",
        value: {
          accountId: accountId.create(ledgerEntry.accountId),
          dataName: ledgerEntry.dataName
        }
      };

    case "claimableBalance":
      const binaryValue = hexToBinary(ledgerEntry.balanceId);
      if (binaryValue.byteLength !== 32) {
        throw new Error(`Length of hash value must be 32 (is ${binaryValue.byteLength})`);
      }

      return {
        type: "claimableBalance",
        value: { balanceId: { type: "claimableBalanceIdTypeV0", value: binaryValue } }
      };
  }
}

export function simplify(ledgerEntry: xdr.LedgerKey): SimpleLedgerKey {
  switch (ledgerEntry.type) {
    case "account":
      return {
        type: "account",
        accountId: accountId.simplify(ledgerEntry.value.accountId)
      };
    case "trustline":
      return {
        type: "trustline",
        accountId: accountId.simplify(ledgerEntry.value.accountId),
        asset: asset.simplify(ledgerEntry.value.asset)
      };
    case "offer":
      return {
        type: "offer",
        sellerId: accountId.simplify(ledgerEntry.value.sellerId),
        offerId: int64.simplify(ledgerEntry.value.offerId)
      };
    case "data":
      return {
        type: "data",
        accountId: accountId.simplify(ledgerEntry.value.accountId),
        dataName: ledgerEntry.value.dataName
      };
    case "claimableBalance":
      return {
        type: "claimableBalance",
        balanceId: binaryToHex(ledgerEntry.value.balanceId.value)
      };
  }
}
