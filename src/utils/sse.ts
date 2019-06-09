import EventSource from "./sse.node";

import { UrlBuilder } from "./url";
import { UrlQuery } from "../horizon/server";

export function createStream<T>(
  urlBuilder: UrlBuilder,
  path: string[],
  query: UrlQuery,
  onMessage: (message: T) => void
) {
  query["X-Client-Name"] = "ts-stellar-sdk";

  let eventSource: EventSource | undefined;

  const connect = () => {
    if (eventSource) {
      eventSource.close();
    }
    eventSource = new EventSource(urlBuilder.buildUrl(path, query));

    eventSource.onerror = () => {
      if (!eventSource || eventSource.readyState === eventSource.CLOSED) {
        setTimeout(connect, 1000);
      }
    };

    eventSource.onmessage = event => {
      const result = JSON.parse(event.data);
      query["cursor"] = event.lastEventId || result.paging_token || query["cursor"];
      onMessage(result as T);
    };
  };

  return () => {
    if (eventSource) {
      eventSource.close();
    }
  };
}
