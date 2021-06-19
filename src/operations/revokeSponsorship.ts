import { xdr } from "ts-stellar-xdr";

import * as muxedAccount from "../simpleTypes/muxedAccount";
import * as accountId from "../simpleTypes/accountId";
import * as ledgerKey from "../simpleTypes/ledgerKey";
import * as signerKey from "../simpleTypes/signerKey";
import { convert } from "../utils/conversion";

export type SimpleRevokeSponsorshipOp =
  | {
      type: "revokeSponsorshipLedgerEntry";
      sourceAccount?: muxedAccount.SimpleMuxedAccount;
      ledgerKey: ledgerKey.SimpleLedgerKey;
    }
  | {
      type: "revokeSponsorshipSigner";
      sourceAccount?: muxedAccount.SimpleMuxedAccount;
      accountId: string;
      signerKey: signerKey.SimpleSignerKey;
    };

export function create(simpleOperation: SimpleRevokeSponsorshipOp): xdr.RevokeSponsorshipOp {
  switch (simpleOperation.type) {
    case "revokeSponsorshipLedgerEntry":
      return {
        type: "revokeSponsorshipLedgerEntry",
        value: convert(simpleOperation, ledgerKey.create, "ledgerKey")
      };
    case "revokeSponsorshipSigner":
      return {
        type: "revokeSponsorshipSigner",
        value: {
          accountId: convert(simpleOperation, accountId.create, "accountId"),
          signerKey: convert(simpleOperation, signerKey.create, "signerKey")
        }
      };
  }
}

export function simplify(
  operation: xdr.RevokeSponsorshipOp,
  sourceAccount?: muxedAccount.SimpleMuxedAccount
): SimpleRevokeSponsorshipOp {
  switch (operation.type) {
    case "revokeSponsorshipLedgerEntry":
      return {
        type: "revokeSponsorshipLedgerEntry",
        sourceAccount,
        ledgerKey: ledgerKey.simplify(operation.value)
      };
    case "revokeSponsorshipSigner":
      return {
        type: "revokeSponsorshipSigner",
        sourceAccount,
        accountId: accountId.simplify(operation.value.accountId),
        signerKey: signerKey.simplify(operation.value.signerKey)
      };
  }
}
