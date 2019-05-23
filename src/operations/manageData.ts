import { ManageDataOp, String64 } from "ts-stellar-xdr";
import { stringToBinary } from "../utils/utf8";

export interface SimpleManageDataOp {
  type: "manageDatum";
  sourceAccount?: string;
  dataName: string;
  dataValue?: ArrayBuffer | string;
}

export function createManageDataOp(simpleOperation: SimpleManageDataOp): ManageDataOp {
  if (!String64.isValid(simpleOperation.dataName)) {
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
