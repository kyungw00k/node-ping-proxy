var Socks = require('socks')
    , URL = require('url')
    , https = require('https')
    , HttpsProxyAgent = require('https-proxy-agent')
    , validUrl = require('valid-url');

// Object.assign Polifill
if (typeof Object.assign != 'function') {
  Object.assign = function(target, varArgs) { // .length of function is 2
    'use strict';
    if (target == null) { // TypeError if undefined or null
      throw new TypeError('Cannot convert undefined or null to object');
    }

    var to = Object(target);

    for (var index = 1; index < arguments.length; index++) {
      var nextSource = arguments[index];

      if (nextSource != null) { // Skip over if undefined or null
        for (var nextKey in nextSource) {
          // Avoid bugs when hasOwnProperty is shadowed
          if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
            to[nextKey] = nextSource[nextKey];
          }
        }
      }
    }
    return to;
  };
}

var defaults = {
  secureProtocol: 'SSLv3_method',
};

function pingProxyAsync(_options, callback) {
    'use strict';

    var options = Object.assign({}, defaults, _options);

    if (options.secureProtocol) {
      https.globalAgent.options.secureProtocol = options.secureProtocol;
    }

    var httpOptions = {hostname: 'www.google.com', port: '443'};

    try {
        ['proxyHost', 'proxyPort'].forEach(function (required) {
            if (!options[required]) {
                throw required;
            }
        });
    } catch (missing) {
        callback(new Error("Missing required params: " + missing));
        return;
    }

    options.proxyHost = "" + options.proxyHost;

    if (!!options.proxyTestUrl && validUrl.isWebUri(options.proxyTestUrl)) {
        options.proxyTestUrl = URL.parse(options.proxyTestUrl);

        httpOptions.hostname = options.proxyTestUrl.hostname;
        httpOptions.port = options.proxyTestUrl.port || options.proxyTestUrl.protocol.indexOf('https') > -1 ? 443 : 80;
    }

    if (!!options.proxySocks) {
        if ([4, 5].indexOf(options.proxySocks) == -1) {
            callback(new Error("Invalid SOCKS Protocol. Use '4' or '5' instead."));
            return;
        }

        httpOptions.agent = new Socks.Agent(
            {
                proxy: {
                    ipaddress: options.proxyHost
                    , port: +options.proxyPort
                    , type: +options.proxySocks
                }
            }
            , true
            , false
        );
    } else {
        httpOptions.agent = new HttpsProxyAgent(
            {
                host: options.proxyHost
                , port: options.proxyPort
            }
        );
    }

    https.get(httpOptions, function (res) {
        res.on("data", function (/*chunk*/) {
            /* LET IT GO */
        });

        res.on("end", function () {
            if (httpOptions.agent.encryptedSocket) {
                httpOptions.agent.encryptedSocket.end();
            }

            callback(null, options, res.statusCode);
        });

        res.on("error", function (err) {
            callback(err, options, res.statusCode);
        });
    })
    .on("error", function (err) {
        // catch errors like ECONNREFUSED
        callback(err, options);
    });
}

module.exports = pingProxyAsync;
