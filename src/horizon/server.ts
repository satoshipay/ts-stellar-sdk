import fetch from "isomorphic-fetch";

import { UrlBuilder } from "../utils/url";
import { createStream } from "../utils/sse";
import { Paged, PagingOptions } from "./resources/general";

import { rootActionProcessor } from "./resources/root";
import { metricsActionProcessor } from "./resources/metrics";
import { ledgerIndexProcessor, ledgerShowProcessor } from "./resources/ledger";
import { operationIndexProcessor, paymentsIndexProcessor, operationShowProcessor } from "./resources/operation";
import { effectIndexProcessor } from "./resources/effect";
import { offersByAccountProcessor } from "./resources/offer";
import { tradeIndexProcessor } from "./resources/trade";
import { dataShowProcessor, dataShowProcessorSse } from "./resources/data";
import { tradeAggregateIndexProcessor } from "./resources/trageAggregation";
import { orderBookShowProcessor } from "./resources/orderbook";
import { pathIndexProcessor } from "./resources/paymentPath";
import { assetProcessor } from "./resources/asset";
import { transactionShowProcessor, transactionIndexProcessor } from "./resources/transaction";
import { operationFeeStatsProcessor } from "./resources/fee";
import { friendbotProcessor } from "./resources/friendbot";
import { accountShowProcessor } from "./resources/account";

export type UrlQuery = Record<string, string | number | boolean | undefined>;
export type UrlParameters = { path: string[]; query?: UrlQuery };
export type FetchProcessor<S, T, U> = {
  options: (option: S) => UrlParameters;
  response: (response: T) => U;
};

export class Horizon {
  public urlBuilder: UrlBuilder;

  constructor(baseUrl: string) {
    this.urlBuilder = new UrlBuilder(baseUrl);
  }

  getRootInfo = this.createStaticGetter(rootActionProcessor);

  getMetrics = this.createStaticGetter(metricsActionProcessor);

  getLedger = this.createBasicGetter(ledgerShowProcessor);
  getLedgers = this.createStaticPagingGetter(ledgerIndexProcessor);
  streamLedgers = this.createStaticPagingStreamer(ledgerIndexProcessor);

  getOperation = this.createBasicGetter(operationShowProcessor);
  getOperations = this.createOptionalPagingGetter(operationIndexProcessor);
  streamOperations = this.createOptionalPagingStreamer(operationIndexProcessor);

  getTransaction = this.createBasicGetter(transactionShowProcessor);
  getTransactions = this.createOptionalPagingGetter(transactionIndexProcessor);
  streamTransactions = this.createOptionalPagingStreamer(transactionIndexProcessor);

  getPayments = this.createOptionalPagingGetter(paymentsIndexProcessor);
  streamPayments = this.createOptionalPagingStreamer(paymentsIndexProcessor);

  getEffects = this.createOptionalPagingGetter(effectIndexProcessor);
  streamEffects = this.createOptionalPagingStreamer(effectIndexProcessor);

  getOffers = this.createBasicPagedGetter(offersByAccountProcessor);
  streamOffers = this.createBasicPagingStreamer(offersByAccountProcessor);

  getTrades = this.createOptionalPagingGetter(tradeIndexProcessor);
  streamTrades = this.createOptionalPagingStreamer(tradeIndexProcessor);

  getAccount = this.createBasicGetter(accountShowProcessor);
  streamAccount = this.createBasicStreamer(accountShowProcessor);

  getAccountData = this.createBasicGetter(dataShowProcessor);
  streamAccountData = this.createBasicStreamer(dataShowProcessorSse);

  getTradeAggregations = this.createBasicPagedGetter(tradeAggregateIndexProcessor);

  getOrderBook = this.createBasicGetter(orderBookShowProcessor);
  streamOrderBook = this.createBasicStreamer(orderBookShowProcessor);

  getPaths = this.createBasicPagedGetter(pathIndexProcessor);

  getAssets = this.createOptionalPagingGetter(assetProcessor);

  getFees = this.createStaticGetter(operationFeeStatsProcessor);

  friendbot = this.createBasicGetter(friendbotProcessor);

  // TODO post transaction

  /////////////////////////////////////

  private createBasicGetter<S, T, U>(fetchProcessor: FetchProcessor<S, T, U>) {
    return async (options: S) => {
      const { path, query } = fetchProcessor.options(options);
      const response = await fetch(this.urlBuilder.buildUrl(path, query));
      const parsedResponse = (await response.json()) as T;
      return fetchProcessor.response(parsedResponse);
    };
  }

  private createStaticGetter<S, T, U>(fetchProcessor: FetchProcessor<S | undefined, T, U>) {
    const getter = this.createBasicGetter(fetchProcessor);
    return () => getter(undefined);
  }

  private createBasicPagedGetter<S, T, U>(fetchProcessor: FetchProcessor<S, T, U>) {
    return (options: S) => {
      const { path, query } = fetchProcessor.options(options);
      const pagedFetchProcessor = {
        options: (pagingOptions?: PagingOptions) => {
          return { path, query: Object.assign({}, query, pagingOptions || {}) };
        },
        response: (response: Paged<T>): Paged<U> => {
          return {
            ...response,
            _embedded: {
              records: response._embedded.records.map(fetchProcessor.response)
            }
          };
        }
      };

      const getter = this.createBasicGetter(pagedFetchProcessor);
      return (options?: PagingOptions) => getter(options);
    };
  }

  private createStaticPagingGetter<S, T, U>(fetchProcessor: FetchProcessor<S | undefined, T, U>) {
    const pagedGetter = this.createBasicPagedGetter(fetchProcessor);
    return pagedGetter(undefined);
  }

  private createOptionalPagingGetter<S, T, U>(fetchProcessor: FetchProcessor<S | undefined, T, U>) {
    const pagedGetter = this.createBasicPagedGetter(fetchProcessor);
    return (options?: S) => pagedGetter(options);
  }

  private createBasicStreamer<S, T, U>(fetchProcessor: FetchProcessor<S, T, U>) {
    return (onMessage: (message: U) => void, options: S) => {
      const { path, query } = fetchProcessor.options(options);
      return createStream<T>(this.urlBuilder, path, query || {}, (message: T) => {
        onMessage(fetchProcessor.response(message));
      });
    };
  }

  private createBasicPagingStreamer<S, T, U>(fetchProcessor: FetchProcessor<S, T, U>) {
    const pagedFetchProcessor = {
      options: (options: { options: S; paging?: PagingOptions }) => {
        const { path, query } = fetchProcessor.options(options.options);
        return { path, query: Object.assign({}, query, options.paging || {}) };
      },
      response: fetchProcessor.response
    };
    return this.createBasicStreamer(pagedFetchProcessor);
  }

  private createOptionalPagingStreamer<S, T, U>(fetchProcessor: FetchProcessor<S | undefined, T, U>) {
    const streamer = this.createBasicPagingStreamer(fetchProcessor);
    return (onMessage: (message: U) => void, options?: { options?: S; paging?: PagingOptions }) =>
      streamer(onMessage, { options: undefined, ...options });
  }

  private createStaticPagingStreamer<S, T, U>(fetchProcessor: FetchProcessor<S | undefined, T, U>) {
    const streamer = this.createBasicPagingStreamer(fetchProcessor);
    return (onMessage: (message: U) => void, paging?: PagingOptions) =>
      streamer(onMessage, { options: undefined, paging });
  }
}
