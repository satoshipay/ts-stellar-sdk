import { xdr } from "ts-stellar-xdr";

import * as accountId from "./simpleTypes/accountId";
import { convertOptional } from "./utils/conversion";

import * as createAccount from "./operations/createAccount";
import * as payment from "./operations/payment";
import * as pathPayment from "./operations/pathPaymant";
import * as manageSellOffer from "./operations/manageSellOffer";
import * as createPassiveSellOffer from "./operations/createPassiveSellOrder";
import * as changeTrust from "./operations/changeTrust";
import * as setOption from "./operations/setOption";
import * as accountMerge from "./operations/accountMerge";
import * as inflation from "./operations/inflation";
import * as allowTrust from "./operations/allowTrust";
import * as bumpSequence from "./operations/bumpSequence";
import * as manageData from "./operations/manageData";
import * as manageBuyOffer from "./operations/manageBuyOffer";

export {
  createAccount,
  payment,
  pathPayment,
  manageSellOffer,
  createPassiveSellOffer,
  changeTrust,
  setOption,
  accountMerge,
  inflation,
  allowTrust,
  bumpSequence,
  manageData,
  manageBuyOffer
};

export type SimpleOperation =
  | createAccount.SimpleCreateAccountOp
  | payment.SimplePaymentOp
  | pathPayment.SimplePathPaymentOp
  | manageSellOffer.SimpleManageSellOfferOp
  | createPassiveSellOffer.SimpleCreatePassiveSellOfferOp
  | setOption.SimpleSetOptionsOp
  | changeTrust.SimpleChangeTrustOp
  | allowTrust.SimpleAllowTrustOp
  | accountMerge.SimpleAccountMergeOp
  | inflation.SimpleInflationOp
  | manageData.SimpleManageDataOp
  | bumpSequence.SimpleBumpSequenceOp
  | manageBuyOffer.SimpleManageBuyOfferOp;

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

    case "pathPayment":
      operationBody = {
        type: "pathPayment",
        value: pathPayment.create(simpleOperation)
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

    case "setOption":
      operationBody = {
        type: "setOption",
        value: setOption.create(simpleOperation)
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

    case "manageDatum":
      operationBody = {
        type: "manageDatum",
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

    default:
      throw new Error(`Unknown operation type`);
  }

  return {
    sourceAccount: convertOptional(simpleOperation, accountId.create, "sourceAccount"),
    body: operationBody
  };
}

export function simplify(operation: xdr.Operation): SimpleOperation {
  const sourceAccountId = operation.sourceAccount ? accountId.simplify(operation.sourceAccount) : undefined;

  switch (operation.body.type) {
    case "createAccount":
      return createAccount.simplify(operation.body.value, sourceAccountId);

    case "payment":
      return payment.simplify(operation.body.value, sourceAccountId);

    case "pathPayment":
      return pathPayment.simplify(operation.body.value, sourceAccountId);

    case "manageSellOffer":
      return manageSellOffer.simplify(operation.body.value, sourceAccountId);

    case "createPassiveSellOffer":
      return createPassiveSellOffer.simplify(operation.body.value, sourceAccountId);

    case "setOption":
      return setOption.simplify(operation.body.value, sourceAccountId);

    case "changeTrust":
      return changeTrust.simplify(operation.body.value, sourceAccountId);

    case "allowTrust":
      return allowTrust.simplify(operation.body.value, sourceAccountId);

    case "accountMerge":
      return accountMerge.simplify(operation.body.value, sourceAccountId);

    case "inflation":
      return inflation.simplify(sourceAccountId);

    case "manageDatum":
      return manageData.simplify(operation.body.value, sourceAccountId);

    case "bumpSequence":
      return bumpSequence.simplify(operation.body.value, sourceAccountId);

    case "manageBuyOffer":
      return manageBuyOffer.simplify(operation.body.value, sourceAccountId);

    default:
      throw new Error(`Unknown operation type`);
  }
}
