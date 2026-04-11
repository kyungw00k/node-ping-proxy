const pingProxyAsync = require('../ping-proxy');
const assert = require('assert');

describe('pingProxyAsync()', function () {
    describe('callback API', function () {
        it('should require "proxyHost"', function (done) {
            pingProxyAsync({
                proxyPort: 8888,
            }, function (err) {
                assert.ok(err);
                assert.strictEqual(err.message, 'Missing required params: proxyHost');
                done();
            });
        });

        it('should require "proxyPort"', function (done) {
            pingProxyAsync({
                proxyHost: '127.0.0.1',
            }, function (err) {
                assert.ok(err);
                assert.strictEqual(err.message, 'Missing required params: proxyPort');
                done();
            });
        });

        it('should reject invalid SOCKS protocol', function (done) {
            pingProxyAsync({
                proxyHost: '127.0.0.1',
                proxyPort: 8888,
                proxySocks: '4a',
            }, function (err) {
                assert.ok(err);
                assert.strictEqual(err.message, "Invalid SOCKS Protocol. Use '4' or '5' instead.");
                done();
            });
        });

        it('should reject invalid proxy test URL', function (done) {
            pingProxyAsync({
                proxyHost: '127.0.0.1',
                proxyPort: 8888,
                proxyTestUrl: 'not-a-url',
            }, function (err) {
                assert.ok(err);
                assert.ok(err.message.includes('Invalid proxy test URL'));
                done();
            });
        });

        it('should reject non-http/https proxy test URL', function (done) {
            pingProxyAsync({
                proxyHost: '127.0.0.1',
                proxyPort: 8888,
                proxyTestUrl: 'ftp://example.com',
            }, function (err) {
                assert.ok(err);
                assert.ok(err.message.includes('Invalid proxy test URL protocol'));
                done();
            });
        });

        it('should accept SOCKS 4', function (done) {
            pingProxyAsync({
                proxyHost: '127.0.0.1',
                proxyPort: 1080,
                proxySocks: 4,
                timeout: 1000,
            }, function (err) {
                // Will fail to connect, but should not throw validation error
                assert.ok(err);
                assert.ok(!err.message.includes('Invalid SOCKS'));
                done();
            });
        });

        it('should accept SOCKS 5', function (done) {
            pingProxyAsync({
                proxyHost: '127.0.0.1',
                proxyPort: 1080,
                proxySocks: 5,
                timeout: 1000,
            }, function (err) {
                assert.ok(err);
                assert.ok(!err.message.includes('Invalid SOCKS'));
                done();
            });
        });
    });

    describe('Promise API', function () {
        it('should return a Promise when no callback is provided', function () {
            const result = pingProxyAsync({
                proxyHost: '127.0.0.1',
                proxyPort: 8888,
                timeout: 1000,
            });
            assert.ok(result instanceof Promise);
            return result.catch(function (err) {
                assert.ok(err);
            });
        });

        it('should reject Promise when required params are missing', function () {
            return pingProxyAsync({
                proxyPort: 8888,
            }).then(function () {
                throw new Error('Should have rejected');
            }, function (err) {
                assert.strictEqual(err.message, 'Missing required params: proxyHost');
            });
        });
    });

    describe('timeout', function () {
        it('should timeout with custom timeout value', function (done) {
            this.timeout(5000);
            pingProxyAsync({
                proxyHost: '192.0.2.1', // TEST-NET, should not be reachable
                proxyPort: 8888,
                timeout: 500,
            }, function (err) {
                assert.ok(err);
                done();
            });
        });
    });
});
