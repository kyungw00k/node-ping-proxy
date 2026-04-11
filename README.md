# node-ping-proxy

> Simple Proxy Checker

## Installation

```
npm install ping-proxy
```

## Usage

### Callback API

```js
const pingProxy = require('ping-proxy');

pingProxy(
  {
    proxyHost: '5.9.124.48',
    proxyPort: 9378,
    proxySocks: 5,              // optional: 4 or 5 for SOCKS
    proxyTestUrl: 'https://kingproxies.com/', // optional: test URL
    timeout: 5000,              // optional: timeout in ms (default: 10000)
  },
  function (err, options, statusCode) {
    if (err) {
      console.error(err);
      return;
    }
    console.log('Status:', statusCode);
  }
);
```

### Promise API

```js
const pingProxy = require('ping-proxy');

pingProxy({
  proxyHost: '5.9.124.48',
  proxyPort: 9378,
})
  .then(({ options, statusCode }) => {
    console.log('Status:', statusCode);
  })
  .catch((err) => {
    console.error(err);
  });
```

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `proxyHost` | string | *(required)* | Proxy server hostname |
| `proxyPort` | number | *(required)* | Proxy server port |
| `proxySocks` | number | - | SOCKS protocol type: `4` or `5`. Omit for HTTP proxy. |
| `proxyTestUrl` | string | `https://www.google.com` | URL to test the proxy against |
| `timeout` | number | `10000` | Request timeout in milliseconds |

## License

[MIT license](http://en.wikipedia.org/wiki/MIT_License).
