import { xdr } from "ts-stellar-xdr";

import { createAccountId, simplifyAccountId } from "./simpleTypes/accountId";

import { SimpleCreateAccountOp, createCreateAccountOp, simplifyCreateAccountOp } from "./operations/createAccount";
import { SimplePaymentOp, createPaymentOp, simplifyPaymentOp } from "./operations/payment";
import { SimplePathPaymentOp, createPathPaymentOp, simplifyPathPaymentOp } from "./operations/pathPaymant";
import {
  SimpleManageSellOfferOp,
  createManageSellOfferOp,
  simplifyManageSellOfferOp
} from "./operations/manageSellOffer";
import {
  SimpleCreatePassiveSellOfferOp,
  createPassiveSellOfferOp,
  simplifyPassiveSellOfferOp
} from "./operations/createPassiveSellOrder";
import { SimpleChangeTrustOp, createChangeTrustOp, simplifyChangeTrustOp } from "./operations/changeTrust";
import { SimpleSetOptionsOp, createSetOptionstOp, simplifySetOptionstOp } from "./operations/setOptions";
import { SimpleAccountMergeOp, createAccountMergeOp, simplifyAccountMergeOp } from "./operations/accountMerge";
import { SimpleInflationOp, simplifyInflationOp } from "./operations/inflation";
import { SimpleAllowTrustOp, createAllowTrustOp, simplifyAllowTrustOp } from "./operations/allowTrust";
import { SimpleBumpSequenceOp, createBumpSequenceOp, simplifyBumpSequenceOp } from "./operations/bumpSequence";
import { SimpleManageDataOp, createManageDataOp, simplifyManageDataOp } from "./operations/manageData";
import { SimpleManageBuyOfferOp, createManageBuyOfferOp, simplifyManageBuyOfferOp } from "./operations/manageBuyOffer";
import { convertOptional } from "./utils/conversion";

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

export function createOperation(simpleOperation: SimpleOperation): xdr.Operation {
  let operationBody: xdr.OperationBody;
  switch (simpleOperation.type) {
    case "createAccount":
      operationBody = {
        type: "createAccount",
        value: createCreateAccountOp(simpleOperation)
      };
      break;

    case "payment":
      operationBody = {
        type: "payment",
        value: createPaymentOp(simpleOperation)
      };
      break;

    case "pathPayment":
      operationBody = {
        type: "pathPayment",
        value: createPathPaymentOp(simpleOperation)
      };
      break;

    case "manageSellOffer":
      operationBody = {
        type: "manageSellOffer",
        value: createManageSellOfferOp(simpleOperation)
      };
      break;

    case "createPassiveSellOffer":
      operationBody = {
        type: "createPassiveSellOffer",
        value: createPassiveSellOfferOp(simpleOperation)
      };
      break;

    case "setOption":
      operationBody = {
        type: "setOption",
        value: createSetOptionstOp(simpleOperation)
      };
      break;

    case "changeTrust":
      operationBody = {
        type: "changeTrust",
        value: createChangeTrustOp(simpleOperation)
      };
      break;

    case "allowTrust":
      operationBody = {
        type: "allowTrust",
        value: createAllowTrustOp(simpleOperation)
      };
      break;

    case "accountMerge":
      operationBody = {
        type: "accountMerge",
        value: createAccountMergeOp(simpleOperation)
      };
      break;

    case "inflation":
      operationBody = {
        type: "inflation"
      };
      break;

    case "manageDatum":
      operationBody = {
        type: "manageDatum",
        value: createManageDataOp(simpleOperation)
      };
      break;

    case "bumpSequence":
      operationBody = {
        type: "bumpSequence",
        value: createBumpSequenceOp(simpleOperation)
      };
      break;

    case "manageBuyOffer":
      operationBody = {
        type: "manageBuyOffer",
        value: createManageBuyOfferOp(simpleOperation)
      };
      break;

    default:
      throw new Error(`Unknown operation type`);
  }

  return {
    sourceAccount: convertOptional(simpleOperation, createAccountId, "sourceAccount"),
    body: operationBody
  };
}

export function simplifyOperation(operation: xdr.Operation): SimpleOperation {
  const sourceAccountId = operation.sourceAccount ? simplifyAccountId(operation.sourceAccount) : undefined;

  switch (operation.body.type) {
    case "createAccount":
      return simplifyCreateAccountOp(operation.body.value, sourceAccountId);

    case "payment":
      return simplifyPaymentOp(operation.body.value, sourceAccountId);

    case "pathPayment":
      return simplifyPathPaymentOp(operation.body.value, sourceAccountId);

    case "manageSellOffer":
      return simplifyManageSellOfferOp(operation.body.value, sourceAccountId);

    case "createPassiveSellOffer":
      return simplifyPassiveSellOfferOp(operation.body.value, sourceAccountId);

    case "setOption":
      return simplifySetOptionstOp(operation.body.value, sourceAccountId);

    case "changeTrust":
      return simplifyChangeTrustOp(operation.body.value, sourceAccountId);

    case "allowTrust":
      return simplifyAllowTrustOp(operation.body.value, sourceAccountId);

    case "accountMerge":
      return simplifyAccountMergeOp(operation.body.value, sourceAccountId);

    case "inflation":
      return simplifyInflationOp(sourceAccountId);

    case "manageDatum":
      return simplifyManageDataOp(operation.body.value, sourceAccountId);

    case "bumpSequence":
      return simplifyBumpSequenceOp(operation.body.value, sourceAccountId);

    case "manageBuyOffer":
      return simplifyManageBuyOfferOp(operation.body.value, sourceAccountId);

    default:
      throw new Error(`Unknown operation type`);
  }
}
