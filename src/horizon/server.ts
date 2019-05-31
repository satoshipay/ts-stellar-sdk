import fetch from "isomorphic-fetch";
import { UrlBuilder } from "../utils/url";
import { RootResponse } from "./resources/root";
import { MetricsResponse } from "./resources/metrics";
import { Paged } from "./resources/general";
import { LedgerResponse } from "./resources/ledger";
import { OperationResponse, BaseOperationResponse, PaymentOpResponse } from "./resources/operation";
import { EffectResponse } from "./resources/effect";
import { OfferResponse } from "./resources/offer";
import { TradeResponse } from "./resources/trade";
import { DataResponse } from "./resources/data";
import { TradeAggregationsResponse } from "./resources/trageAggregation";
import { OrderBookResponse } from "./resources/orderbook";
import { PaymentPathResponse } from "./resources/paymentPath";
import { AssetStatResponse } from "./resources/asset";
import { TransactionSuccessResponse } from "./resources/transaction";

export interface OperationIndexOptions {
  include_failed: boolean;
}

export interface TradeIndexOptions {
  base_asset_type?: "native" | "credit_alphanum4" | "credit_alphanum12";
  base_asset_issuer?: string;
  base_asset_code?: string;
  counter_asset_type?: "native" | "credit_alphanum4" | "credit_alphanum12";
  counter_asset_issuer?: string;
  counter_asset_code?: string;
}

export interface TradeAggregationsIndexOptions {
  base_asset_type: "native" | "credit_alphanum4" | "credit_alphanum12";
  base_asset_issuer?: string;
  base_asset_code?: string;
  counter_asset_type: "native" | "credit_alphanum4" | "credit_alphanum12";
  counter_asset_issuer?: string;
  counter_asset_code?: string;
  offset?: number;
  resolution?: number;
  start_time?: number;
  end_time?: number;
}

export interface OrderBookShowOptions {
  selling_asset_type: "native" | "credit_alphanum4" | "credit_alphanum12";
  selling_asset_issuer?: string;
  selling_asset_code?: string;
  buying_asset_type: "native" | "credit_alphanum4" | "credit_alphanum12";
  buying_asset_issuer?: string;
  buying_asset_code?: string;
  limit?: number;
}

export interface PathIndexOptions {
  destination_amount: string; // a lumen amount string (not stroops!)
  destination_account: string;
  destination_asset_type: "native" | "credit_alphanum4" | "credit_alphanum12";
  destination_asset_issuer?: string;
  destination_asset_code?: string;
}

export interface AssetOptions {
  asset_issuer: string;
  asset_code: string;
}

export interface PagingOptions {
  cursor?: "now" | number;
  order?: "asc" | "desc";
  limit?: number;
}

export class Horizon {
  public urlBuilder: UrlBuilder;

  constructor(baseUrl: string) {
    this.urlBuilder = new UrlBuilder(baseUrl);
  }

  async getRootInfo() {
    return this.get<RootResponse>([]);
  }

  async getMetrics() {
    return this.get<MetricsResponse>(["metrics"]);
  }

  getLedgers() {
    return this.getPager<LedgerResponse>(["ledgers"]);
  }

  async getLedger(ledgerSequence: string) {
    return this.get<LedgerResponse>(["ledgers", ledgerSequence]);
  }

  async getLedgerTransactions(ledgerSequence: string) {
    // TODO
  }

  getLedgerOperations(ledgerSequence: string, options?: OperationIndexOptions) {
    return this.getPager<OperationResponse>(["ledgers", ledgerSequence, "operations"], options);
  }

  getLedgerPayments(ledgerSequence: string, options?: OperationIndexOptions) {
    return this.getPager<BaseOperationResponse & PaymentOpResponse>(["ledgers", ledgerSequence, "payments"], options);
  }

  getLedgerEffects(ledgerSequence: string) {
    return this.getPager<EffectResponse>(["ledgers", ledgerSequence, "effects"]);
  }

  async getAccount(accountId: string) {
    // TODO
  }

  async getAccountTransactions(accountId: string) {
    // TODO
  }

  getAccountOperations(accountId: string, options?: OperationIndexOptions) {
    return this.getPager<OperationResponse>(["accounts", accountId, "operations"], options);
  }

  getAccountPayments(accountId: string, options?: OperationIndexOptions) {
    return this.getPager<BaseOperationResponse & PaymentOpResponse>(["accounts", accountId, "payments"], options);
  }

  getAccountEffects(accountId: string) {
    return this.getPager<EffectResponse>(["accounts", accountId, "effect"]);
  }

  getAccountOffers(accountId: string) {
    return this.getPager<OfferResponse>(["accounts", accountId, "offers"]);
  }

  getAccountTrades(accountId: string, options?: TradeIndexOptions) {
    return this.getPager<TradeResponse>(["accounts", accountId, "trades"], options);
  }

  async getAccountData(accountId: string, key: string): Promise<DataResponse> {
    return this.get(["accounts", accountId, "data", key]);
  }

  async getTransactions() {
    // TODO
  }

  async getTransaction(transactionId: string) {
    // TODO
  }

  getTransactionOperations(transactionId: string, options?: OperationIndexOptions) {
    return this.getPager<OperationResponse>(["transactions", transactionId, "operations"], options);
  }

  getTransactionPayments(transactionId: string, options?: OperationIndexOptions) {
    return this.getPager<BaseOperationResponse & PaymentOpResponse>(
      ["transactions", transactionId, "payments"],
      options
    );
  }

  getTransactionEffects(transactionId: string) {
    return this.getPager<EffectResponse>(["transactions", transactionId, "effect"]);
  }

  getOperations(options?: OperationIndexOptions) {
    return this.getPager<OperationResponse>(["operations"], options);
  }

  async getOperation(operationId: string): Promise<OperationResponse> {
    return this.get(["operations", operationId]);
  }

  getOperationEffects(operationId: string) {
    return this.getPager<EffectResponse>(["operations", operationId, "effects"]);
  }

  getPayments(options?: OperationIndexOptions) {
    return this.getPager<BaseOperationResponse & PaymentOpResponse>(["payments"], options);
  }

  getEffects() {
    return this.getPager<EffectResponse>(["effects"]);
  }

  getTrades(options?: TradeIndexOptions) {
    return this.getPager<TradeResponse>(["trades"], options);
  }

  getTradeAggregations(options: TradeAggregationsIndexOptions) {
    return this.getPager<TradeAggregationsResponse>(["trades"], options);
  }

  getOfferTrades(options?: TradeIndexOptions) {
    return this.getPager<TradeResponse>(["trades"], options);
  }

  getOrderBook(options?: OrderBookShowOptions) {
    return this.getPager<OrderBookResponse>(["order_book"], options);
  }

  // TODO post transaction

  getPaths(options: PathIndexOptions) {
    return this.getPager<PaymentPathResponse>(["paths"], options);
  }

  getAssets(options?: AssetOptions) {
    return this.getPager<AssetStatResponse>(["assets"], options);
  }

  getFeeStats() {
    return this.get(["fee_stats"]);
  }

  friendbot(address: string) {
    return this.get<TransactionSuccessResponse>(["friendbot"], { addr: address });
  }

  private async get<S>(pathSegments: string[], query?: any) {
    const response = await fetch(this.urlBuilder.buildUrl(pathSegments, query));
    return response.json() as Promise<S>;
  }

  private getPager<S>(pathSegments: string[], query?: any) {
    return async (pagingOptions?: PagingOptions) => {
      return this.get<Paged<S>>(pathSegments, Object.assign({}, query, pagingOptions));
    };
  }
}
