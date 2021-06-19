import { xdr } from "ts-stellar-xdr";

import * as muxedAccount from "./simpleTypes/muxedAccount";
import { convertOptional } from "./utils/conversion";

import * as createAccount from "./operations/createAccount";
import * as payment from "./operations/payment";
import * as pathPaymentStrictReceive from "./operations/pathPaymentStrictReceive";
import * as manageSellOffer from "./operations/manageSellOffer";
import * as createPassiveSellOffer from "./operations/createPassiveSellOrder";
import * as setOptions from "./operations/setOptions";
import * as changeTrust from "./operations/changeTrust";
import * as allowTrust from "./operations/allowTrust";
import * as accountMerge from "./operations/accountMerge";
import * as inflation from "./operations/inflation";
import * as manageData from "./operations/manageData";
import * as bumpSequence from "./operations/bumpSequence";
import * as manageBuyOffer from "./operations/manageBuyOffer";
import * as pathPaymentStrictSend from "./operations/pathPaymentStrictSend";
import * as createClaimableBalance from "./operations/createClaimableBalance";
import * as claimClaimableBalance from "./operations/claimClaimableBalance";
import * as beginSponsoringFutureReserves from "./operations/beginSponsoringFutureReserves";
import * as endSponsoringFutureReserves from "./operations/endSponsoringFutureReserves";
import * as revokeSponsorship from "./operations/revokeSponsorship";
import * as clawback from "./operations/clawback";
import * as clawbackClaimableBalance from "./operations/clawbackClaimableBalance";
import * as setTrustLineFlags from "./operations/setTrustLineFlags";

export {
  createAccount,
  payment,
  pathPaymentStrictReceive,
  manageSellOffer,
  createPassiveSellOffer,
  setOptions,
  changeTrust,
  allowTrust,
  accountMerge,
  inflation,
  manageData,
  bumpSequence,
  manageBuyOffer,
  pathPaymentStrictSend,
  createClaimableBalance,
  claimClaimableBalance,
  beginSponsoringFutureReserves,
  endSponsoringFutureReserves,
  revokeSponsorship,
  clawback,
  clawbackClaimableBalance,
  setTrustLineFlags
};

export type SimpleOperation =
  | createAccount.SimpleCreateAccountOp
  | payment.SimplePaymentOp
  | pathPaymentStrictReceive.SimplePathPaymentStrictReceiveOp
  | manageSellOffer.SimpleManageSellOfferOp
  | createPassiveSellOffer.SimpleCreatePassiveSellOfferOp
  | setOptions.SimpleSetOptionsOp
  | changeTrust.SimpleChangeTrustOp
  | allowTrust.SimpleAllowTrustOp
  | accountMerge.SimpleAccountMergeOp
  | inflation.SimpleInflationOp
  | manageData.SimpleManageDataOp
  | bumpSequence.SimpleBumpSequenceOp
  | manageBuyOffer.SimpleManageBuyOfferOp
  | pathPaymentStrictSend.SimplePathPaymentStrictSendOp
  | createClaimableBalance.SimpleCreateClaimableBalanceOp
  | claimClaimableBalance.SimpleClaimClaimableBalanceOp
  | beginSponsoringFutureReserves.SimpleBeginSponsoringFutureReservesOp
  | endSponsoringFutureReserves.SimpleEndSponsoringFutureReservesOp
  | revokeSponsorship.SimpleRevokeSponsorshipOp
  | clawback.SimpleClawbackOp
  | clawbackClaimableBalance.SimpleClawbackClaimableBalanceOp
  | setTrustLineFlags.SimpleSetTrustLineFlagsOp;

export function create(simpleOperation: SimpleOperation): xdr.Operation {
  let operationBody: xdr.OperationBody;
  switch (simpleOperation.type) {
    case "createAccount":
      operationBody = {
        type: "createAccount",
        value: createAccount.create(simpleOperation)
      };
      break;

    case "payment":
      operationBody = {
        type: "payment",
        value: payment.create(simpleOperation)
      };
      break;

    case "pathPaymentStrictReceive":
      operationBody = {
        type: "pathPaymentStrictReceive",
        value: pathPaymentStrictReceive.create(simpleOperation)
      };
      break;

    case "manageSellOffer":
      operationBody = {
        type: "manageSellOffer",
        value: manageSellOffer.create(simpleOperation)
      };
      break;

    case "createPassiveSellOffer":
      operationBody = {
        type: "createPassiveSellOffer",
        value: createPassiveSellOffer.create(simpleOperation)
      };
      break;

    case "setOptions":
      operationBody = {
        type: "setOptions",
        value: setOptions.create(simpleOperation)
      };
      break;

    case "changeTrust":
      operationBody = {
        type: "changeTrust",
        value: changeTrust.create(simpleOperation)
      };
      break;

    case "allowTrust":
      operationBody = {
        type: "allowTrust",
        value: allowTrust.create(simpleOperation)
      };
      break;

    case "accountMerge":
      operationBody = {
        type: "accountMerge",
        value: accountMerge.create(simpleOperation)
      };
      break;

    case "inflation":
      operationBody = {
        type: "inflation"
      };
      break;

    case "manageData":
      operationBody = {
        type: "manageData",
        value: manageData.create(simpleOperation)
      };
      break;

    case "bumpSequence":
      operationBody = {
        type: "bumpSequence",
        value: bumpSequence.create(simpleOperation)
      };
      break;

    case "manageBuyOffer":
      operationBody = {
        type: "manageBuyOffer",
        value: manageBuyOffer.create(simpleOperation)
      };
      break;

    case "pathPaymentStrictSend":
      operationBody = {
        type: "pathPaymentStrictSend",
        value: pathPaymentStrictSend.create(simpleOperation)
      };
      break;

    case "createClaimableBalance":
      operationBody = {
        type: "createClaimableBalance",
        value: createClaimableBalance.create(simpleOperation)
      };
      break;

    case "claimClaimableBalance":
      operationBody = {
        type: "claimClaimableBalance",
        value: claimClaimableBalance.create(simpleOperation)
      };
      break;

    case "beginSponsoringFutureReserves":
      operationBody = {
        type: "beginSponsoringFutureReserves",
        value: beginSponsoringFutureReserves.create(simpleOperation)
      };
      break;

    case "endSponsoringFutureReserves":
      operationBody = {
        type: "endSponsoringFutureReserves"
      };
      break;

    case "revokeSponsorshipLedgerEntry":
    case "revokeSponsorshipSigner":
      operationBody = {
        type: "revokeSponsorship",
        value: revokeSponsorship.create(simpleOperation)
      };
      break;

    case "clawback":
      operationBody = {
        type: "clawback",
        value: clawback.create(simpleOperation)
      };
      break;

    case "clawbackClaimableBalance":
      operationBody = {
        type: "clawbackClaimableBalance",
        value: clawbackClaimableBalance.create(simpleOperation)
      };
      break;

    case "setTrustLineFlags":
      operationBody = {
        type: "setTrustLineFlags",
        value: setTrustLineFlags.create(simpleOperation)
      };
      break;

    default:
      throw new Error(`Unknown operation type`);
  }

  return {
    sourceAccount: convertOptional(simpleOperation, muxedAccount.create, "sourceAccount"),
    body: operationBody
  };
}

export function simplify(operation: xdr.Operation): SimpleOperation {
  const sourceAccount = operation.sourceAccount ? muxedAccount.simplify(operation.sourceAccount) : undefined;

  switch (operation.body.type) {
    case "createAccount":
      return createAccount.simplify(operation.body.value, sourceAccount);

    case "payment":
      return payment.simplify(operation.body.value, sourceAccount);

    case "pathPaymentStrictReceive":
      return pathPaymentStrictReceive.simplify(operation.body.value, sourceAccount);

    case "manageSellOffer":
      return manageSellOffer.simplify(operation.body.value, sourceAccount);

    case "createPassiveSellOffer":
      return createPassiveSellOffer.simplify(operation.body.value, sourceAccount);

    case "setOptions":
      return setOptions.simplify(operation.body.value, sourceAccount);

    case "changeTrust":
      return changeTrust.simplify(operation.body.value, sourceAccount);

    case "allowTrust":
      return allowTrust.simplify(operation.body.value, sourceAccount);

    case "accountMerge":
      return accountMerge.simplify(operation.body.value, sourceAccount);

    case "inflation":
      return inflation.simplify(sourceAccount);

    case "manageData":
      return manageData.simplify(operation.body.value, sourceAccount);

    case "bumpSequence":
      return bumpSequence.simplify(operation.body.value, sourceAccount);

    case "manageBuyOffer":
      return manageBuyOffer.simplify(operation.body.value, sourceAccount);

    case "pathPaymentStrictSend":
      return pathPaymentStrictSend.simplify(operation.body.value, sourceAccount);

    case "createClaimableBalance":
      return createClaimableBalance.simplify(operation.body.value, sourceAccount);

    case "claimClaimableBalance":
      return claimClaimableBalance.simplify(operation.body.value, sourceAccount);

    case "beginSponsoringFutureReserves":
      return beginSponsoringFutureReserves.simplify(operation.body.value, sourceAccount);

    case "endSponsoringFutureReserves":
      return endSponsoringFutureReserves.simplify(sourceAccount);

    case "revokeSponsorship":
      return revokeSponsorship.simplify(operation.body.value, sourceAccount);

    case "clawback":
      return clawback.simplify(operation.body.value, sourceAccount);

    case "clawbackClaimableBalance":
      return clawbackClaimableBalance.simplify(operation.body.value, sourceAccount);

    case "setTrustLineFlags":
      return setTrustLineFlags.simplify(operation.body.value, sourceAccount);

    default:
      throw new Error(`Unknown operation type`);
  }
}
