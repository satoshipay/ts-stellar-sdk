import { CreatePassiveSellOfferOp } from "ts-stellar-xdr";

import { SimpleAsset, createAsset } from "../simpleTypes/asset";
import { SimpleInt64, createPositiveInt64 } from "../simpleTypes/int64";
import { SimplePrice, createPrice } from "../simpleTypes/price";
import { convert } from "../operation";

export interface SimpleCreatePassiveSellOfferOp {
  type: "createPassiveSellOffer";
  sourceAccount?: string;
  selling: SimpleAsset;
  buying: SimpleAsset;
  amountStroops: SimpleInt64;
  price: SimplePrice;
}

export function createPassiveSellOfferOp(simpleOperation: SimpleCreatePassiveSellOfferOp): CreatePassiveSellOfferOp {
  return {
    selling: convert(simpleOperation, createAsset, "selling"),
    buying: convert(simpleOperation, createAsset, "buying"),
    amount: convert(simpleOperation, createPositiveInt64, "amountStroops"),
    price: convert(simpleOperation, createPrice, "price")
  };
}
