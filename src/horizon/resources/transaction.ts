import { HalLinks } from "./general";

export interface TransactionIndexOptions {
  by?: { idType: "account" | "ledger"; id: string };
  includeFailed?: boolean;
}

export const transactionIndexProcessor = {
  options: (options?: TransactionIndexOptions) => {
    let path: string[] = ["transactions"];

    const by = options && options.by;
    if (by) {
      path = [`${by.idType}s`, by.id, "transactions"];
    }

    let query;
    if (options) {
      query = { include_failed: options.includeFailed };
    }

    return { path, query };
  },
  response: (response: TransactionResponse) => response
};

export interface TransactionShowOptions {
  transactionId: string;
}

export const transactionShowProcessor = {
  options: ({ transactionId }: TransactionShowOptions) => {
    return { path: ["transactions", transactionId] };
  },
  response: (response: TransactionResponse) => response
};

export interface TransactionResponse {
  _links: HalLinks<"self" | "account" | "ledger" | "operations" | "effects" | "precedes" | "succeeds">;
  id: string;
  paging_token: string;
  successful: boolean;
  hash: string;
  ledger: number;
  created_at: string;
  source_account: string;
  source_account_sequence: string;
  fee_paid: number;
  operation_count: number;
  envelope_xdr: string;
  result_xdr: string;
  result_meta_xdr: string;
  fee_meta_xdr: string;
  memo_type: string;
  memo?: string;
  signatures: string[];
  valid_after?: string;
  valid_before?: string;
}
