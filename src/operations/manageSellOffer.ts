import { ManageSellOfferOp } from "ts-stellar-xdr";

import { SimpleAsset, createAsset } from "../simpleTypes/asset";
import { convert } from "../operation";
import { SimpleInt64, createNonNegativeInt64, createInt64 } from "../simpleTypes/int64";
import { SimplePrice, createPrice } from "../simpleTypes/price";

export interface SimpleManageSellOfferOp {
  type: "manageSellOffer";
  sourceAccount?: string;
  selling: SimpleAsset;
  buying: SimpleAsset;
  amountStroops: SimpleInt64;
  price: SimplePrice;
  offerId?: SimpleInt64;
}

export function createManageSellOfferOp(simpleOperation: SimpleManageSellOfferOp): ManageSellOfferOp {
  return {
    selling: convert(simpleOperation, createAsset, "selling"),
    buying: convert(simpleOperation, createAsset, "buying"),
    amount: convert(simpleOperation, createNonNegativeInt64, "amountStroops"),
    price: convert(simpleOperation, createPrice, "price"),
    offerId: convert({ offerId: simpleOperation.offerId || 0 }, createInt64, "offerId")
  };
}
