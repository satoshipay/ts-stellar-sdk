import { HalLinks } from "./general";

export interface TransactionSuccessResponse {
  _links: HalLinks<"transaction">;
  hash: string;
  ledger: number;
  envelope_xdr: string;
  result_xdr: string;
  result_meta_xdr: string;
}
