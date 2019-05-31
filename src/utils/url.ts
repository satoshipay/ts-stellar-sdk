import { Url } from "./url.node";

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

  buildUrl(pathSegments: string[], query?: any): string {
    const newUrl = new Url(this.baseUrl);
    if (pathSegments.length > 0) {
      newUrl.pathname = `${newUrl.pathname}/${pathSegments.join("/")}`;
    }

    if (query) {
      Object.keys(query).forEach(key => {
        const value = query[key].toString();
        newUrl.searchParams.append(key, value);
      });
    }

    return newUrl.toString();
  }
}
