interface PingProxyOptions {
  /** Proxy server hostname */
  proxyHost: string;
  /** Proxy server port */
  proxyPort: number;
  /** SOCKS protocol type (4 or 5). Omit for HTTP proxy. */
  proxySocks?: 4 | 5;
  /** Test URL (default: https://www.google.com) */
  proxyTestUrl?: string;
  /** Request timeout in milliseconds (default: 10000) */
  timeout?: number;
}

interface PingProxyResult {
  options: PingProxyOptions;
  statusCode: number;
}

type PingProxyCallback = (err: Error | null, options?: PingProxyOptions, statusCode?: number) => void;

declare function pingProxy(options: PingProxyOptions, callback: PingProxyCallback): void;
declare function pingProxy(options: PingProxyOptions): Promise<PingProxyResult>;

export = pingProxy;
