# node-ping-proxy [![npm version](https://badge.fury.io/js/ping-proxy.svg)](http://badge.fury.io/js/ping-proxy) ![](https://travis-ci.org/kyungw00k/node-ping-proxy.svg) [![Coverage Status](https://coveralls.io/repos/kyungw00k/node-ping-proxy/badge.svg?branch=master&service=github)](https://coveralls.io/github/kyungw00k/node-ping-proxy?branch=master)
> Simple Proxy Checker

## Examples
To install the module: `npm install ping-proxy`
```
var pingProxy = require('ping-proxy');

pingProxy(
  {
      // Proxy Server Host
      proxyHost: '5.9.124.48',

      // Proxy Server Port
      proxyPort: 9378,

      // (optional)
      // SOCKS Protocol Type
      // Valid types: [4, 5] (note 4 also works for 4a)
      proxySocks: 5,

      // (optional) Test URL
      // (default: https://www.google.com)
      proxyTestUrl: 'https://kingproxies.com/'
  },

  // Callback function to be called after the check
  function (err, options, statusCode) {
    if (err) {
        console.log(err);
    }
    console.log(options, statusCode)
  }
);
```

## License
[MIT license](http://en.wikipedia.org/wiki/MIT_License).
