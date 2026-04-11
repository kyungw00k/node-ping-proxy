const { URL } = require('url');
const https = require('https');
const { HttpsProxyAgent } = require('https-proxy-agent');
const { SocksProxyAgent } = require('socks-proxy-agent');

const DEFAULT_TIMEOUT = 10000;
const DEFAULT_TEST_URL = 'https://www.google.com';

function pingProxyAsync(_options, callback) {
    if (typeof callback !== 'function') {
        return new Promise((resolve, reject) => {
            pingProxyAsync(_options, (err, options, statusCode) => {
                if (err) {
                    reject(err);
                } else {
                    resolve({ options, statusCode });
                }
            });
        });
    }

    const options = Object.assign({}, _options);
    const timeout = options.timeout || DEFAULT_TIMEOUT;

    let finished = false;

    function done(err, opts, statusCode) {
        if (finished) return;
        finished = true;
        callback(err, opts, statusCode);
    }

    const httpOptions = {
        hostname: 'www.google.com',
        port: 443,
    };

    // Validate required params
    for (const required of ['proxyHost', 'proxyPort']) {
        if (!options[required]) {
            callback(new Error('Missing required params: ' + required));
            return;
        }
    }

    options.proxyHost = String(options.proxyHost);

    // Parse test URL
    const testUrl = options.proxyTestUrl || DEFAULT_TEST_URL;
    try {
        const parsedUrl = new URL(testUrl);
        if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
            callback(new Error('Invalid proxy test URL protocol: ' + parsedUrl.protocol));
            return;
        }
        httpOptions.hostname = parsedUrl.hostname;
        httpOptions.port = parsedUrl.port || (parsedUrl.protocol === 'https:' ? 443 : 80);
    } catch (err) {
        callback(new Error('Invalid proxy test URL: ' + testUrl));
        return;
    }

    // Create proxy agent
    if (options.proxySocks) {
        if (![4, 5].includes(options.proxySocks)) {
            callback(new Error("Invalid SOCKS Protocol. Use '4' or '5' instead."));
            return;
        }
        const socksType = options.proxySocks === 4 ? 'socks4' : 'socks5';
        httpOptions.agent = new SocksProxyAgent(
            socksType + '://' + options.proxyHost + ':' + options.proxyPort
        );
    } else {
        httpOptions.agent = new HttpsProxyAgent(
            'http://' + options.proxyHost + ':' + options.proxyPort
        );
    }

    const req = https.get(httpOptions, function (res) {
        res.on('data', function () {});
        res.on('end', function () {
            done(null, options, res.statusCode);
        });
        res.on('error', function (err) {
            done(err, options, res.statusCode);
        });
    });

    req.on('error', function (err) {
        done(err, options);
    });

    const timer = setTimeout(function () {
        req.destroy();
        done(new Error('Request timed out after ' + timeout + 'ms'), options);
    }, timeout);

    req.on('close', function () {
        clearTimeout(timer);
    });
}

module.exports = pingProxyAsync;
