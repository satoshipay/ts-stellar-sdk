import { xdr } from "ts-stellar-xdr";

import * as muxedAccount from "../simpleTypes/muxedAccount";
import { stringToBinary, binaryToString } from "../utils/utf8";

export interface SimpleManageDataOp {
  type: "manageData";
  sourceAccount?: muxedAccount.SimpleMuxedAccount;
  dataName: string;
  dataValue?: ArrayBuffer | string;
}

export function create(simpleOperation: SimpleManageDataOp): xdr.ManageDataOp {
  if (!xdr.String64.isValid(simpleOperation.dataName)) {
    throw new Error(`homeDomain invalid or too long – only 64 bytes allowed`);
  }

  const dataValue =
    typeof simpleOperation.dataValue === "string"
      ? stringToBinary(simpleOperation.dataValue)
      : simpleOperation.dataValue;

  if (dataValue && dataValue.byteLength > 64) {
    throw new Error(`dataValue too long – only 64 bytes allowed`);
  }

  return {
    dataName: simpleOperation.dataName,
    dataValue
  };
}

export function simplify(
  operation: xdr.ManageDataOp,
  sourceAccount?: muxedAccount.SimpleMuxedAccount
): SimpleManageDataOp {
  return {
    type: "manageData",
    sourceAccount,
    dataName: operation.dataName,
    dataValue: operation.dataValue && binaryToString(operation.dataValue)
  };
}
