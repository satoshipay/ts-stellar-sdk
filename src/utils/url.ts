import { Url } from "./url.node";
import { UrlQuery } from "../horizon/server";

export class UrlBuilder {
  private baseUrl: string;
  private url: Url;

  constructor(baseUrl: string) {
    this.baseUrl =
      baseUrl.length > 0 && baseUrl.slice(baseUrl.length - 1) === "/" ? baseUrl.slice(0, baseUrl.length - 1) : baseUrl;

    this.url = new Url(baseUrl);
  }

  getProtocol(): string {
    return this.url.protocol;
  }

  getHostname(): string {
    return this.url.hostname;
  }

  buildUrl(pathSegments: string[], query?: UrlQuery): string {
    const newUrl = new Url(this.baseUrl);
    if (pathSegments.length > 0) {
      newUrl.pathname = `${newUrl.pathname}/${pathSegments.join("/")}`;
    }

    if (query) {
      Object.keys(query).forEach(key => {
        const value = query[key];
        if (value !== undefined) {
          newUrl.searchParams.append(key, value.toString());
        }
      });
    }

    return newUrl.toString();
  }
}
