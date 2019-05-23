import { Operation, OperationBody } from "ts-stellar-xdr";

import { createAccountId } from "./simpleTypes/accountId";

import { SimpleCreateAccountOp, createCreateAccountOp } from "./operations/createAccount";
import { SimplePaymentOp, createPaymentOp } from "./operations/payment";
import { SimplePathPaymentOp, createPathPaymentOp } from "./operations/pathPaymant";
import { SimpleManageSellOfferOp, createManageSellOfferOp } from "./operations/manageSellOffer";
import { SimpleCreatePassiveSellOfferOp, createPassiveSellOfferOp } from "./operations/createPassiveSellOrder";
import { SimpleChangeTrustOp, createChangeTrustOp } from "./operations/changeTrust";
import { SimpleSetOptionsOp, createSetOptionstOp } from "./operations/setOptions";
import { SimpleAccountMergeOp, createAccountMergeOp } from "./operations/accountMerge";
import { SimpleInflationOp } from "./operations/inflation";
import { SimpleAllowTrustOp, createAllowTrustOp } from "./operations/allowTrust";
import { SimpleBumpSequenceOp, createBumpSequenceOp } from "./operations/bumpSequence";
import { SimpleManageDataOp, createManageDataOp } from "./operations/manageData";
import { SimpleManageBuyOfferOp, createManageBuyOfferOp } from "./operations/manageBuyOffer";

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

export function createOperation(simpleOperation: SimpleOperation): Operation {
  let operationBody: OperationBody;
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

export function convert<N extends string, T, S>(object: { [A in N]: S }, converter: (value: S) => T, name: N) {
  try {
    return converter(object[name]);
  } catch (error) {
    throw new Error(`${name} is invalid: ${error.message}`);
  }
}

export function convertOptional<N extends string, T, S>(object: { [A in N]?: S }, converter: (value: S) => T, name: N) {
  try {
    const value: S | undefined = object[name];
    if (typeof value === "undefined") {
      return value;
    }
    return converter(value);
  } catch (error) {
    throw new Error(`${name} is invalid: ${error.message}`);
  }
}
