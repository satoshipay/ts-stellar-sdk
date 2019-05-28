import { xdr } from "ts-stellar-xdr";

import { stringToBinary, binaryToString } from "../utils/utf8";

export interface SimpleManageDataOp {
  type: "manageDatum";
  sourceAccount?: string;
  dataName: string;
  dataValue?: ArrayBuffer | string;
}

export function createManageDataOp(simpleOperation: SimpleManageDataOp): xdr.ManageDataOp {
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

export function simplifyManageDataOp(operation: xdr.ManageDataOp, sourceAccount?: string): SimpleManageDataOp {
  return {
    type: "manageDatum",
    ...(sourceAccount === undefined ? null : { sourceAccount }),
    dataName: operation.dataName,
    ...(operation.dataValue ? { dataValue: binaryToString(operation.dataValue) } : null)
  };
}
