import { HalLinks } from "./general";

export interface FriendbotOptions {
  accountId: string;
}

export const friendbotProcessor = {
  options: (options: FriendbotOptions) => {
    return { path: ["friendbot"], options };
  },
  response: (response: TransactionSuccessResponse) => response
};

export interface TransactionSuccessResponse {
  _links: HalLinks<"transaction">;
  hash: string;
  ledger: number;
  envelope_xdr: string;
  result_xdr: string;
  result_meta_xdr: string;
}
