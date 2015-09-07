var pingProxyAsync = require('../ping-proxy')
    , assert = require("assert");

describe('pingProxyAsync()', function () {
    it('"proxyHost" is required', function (done) {
        pingProxyAsync({
            proxyPort: 8888
        }, function (err) {
            if (err) {
                assert('Missing required params: proxyHost', err.message);
                done();
            }
        });
    });

    it('"proxyPort" is required', function (done) {
        pingProxyAsync({
            proxyHost: '127.0.0.1'
        }, function (err) {
            if (err) {
                assert('Missing required params: proxyPort', err.message);
                done();
            }
        });
    });

    it('"proxySocks" must one of [4, 5]', function (done) {
        pingProxyAsync({
            proxyHost: '127.0.0.1',
            proxyPort: 8888,
            proxySocks: '4a'
        }, function (err) {
            if (err) {
                assert('"Invalid SOCKS Protocol. Use \'4\' or \'5\' instead."', err.message);
                done();
            }
        });
    });

    it('this http proxy must be working', function (done) {
        this.timeout(15000);
        pingProxyAsync({
            proxyHost: '54.187.52.159', // pick one from https://kingproxies.com/
            proxyPort: 3128,
            proxyTestUrl: "https://kingproxies.com/"
        }, function (err, options, statusCode) {
            assert(200, statusCode);
            done();
        });
    });

    it('this socks 4 proxy must be working', function (done) {
        this.timeout(15000);
        pingProxyAsync({
            proxyHost: '83.239.108.238', // pick one from https://kingproxies.com/
            proxyPort: 1080,
            proxySocks: 4,
            proxyTestUrl: "https://kingproxies.com/"
        }, function (err, options, statusCode) {
            assert(200, statusCode);
            done();
        });
    });

    it('this socks 5 proxy must be working', function (done) {
        this.timeout(15000);
        pingProxyAsync({
            proxyHost: '103.246.244.174', // pick one from https://kingproxies.com/
            proxyPort: 9378,
            proxySocks: 5,
            proxyTestUrl: "https://kingproxies.com/"
        }, function (err, options, statusCode) {
            assert(200, statusCode);
            done();
        });
    });
});