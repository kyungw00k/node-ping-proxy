var Socks = require('socks')
    , URL = require('url')
    , https = require('https')
    , HttpsProxyAgent = require('https-proxy-agent')
    , validUrl = require('valid-url');

https.globalAgent.options.secureProtocol = 'SSLv3_method';

function pingProxyAsync(options, callback) {
    'use strict';

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
    });
}

module.exports = pingProxyAsync;