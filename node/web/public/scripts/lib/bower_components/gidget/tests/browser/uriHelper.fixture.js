Hilary.scope('gidget-tests').register({
    name: 'uriHelper.fixture',
    dependencies: ['gidgetScope', 'describe', 'it', 'expect'],
    factory: function (gidgetScope, describe, it, expect) {
        'use strict';

        var uriHelper = gidgetScope.resolve('uriHelper'),
            parseUri = uriHelper.parseUri;

        describe('uriHelper.parseUri', function () {

            describe('when a home path is parsed', function () {
                it('should return a uri with / as the path', function () {
                    // given
                    var expected = '/',
                        actual;

                    // when
                    actual = parseUri(expected);

                    // then
                    expect(actual.path).to.equal(expected);
                });
            }); // /home route

            describe('when a relative path is parsed', function () {
                it('should return a uri with the path and relativePath set', function () {
                    // given
                    var expected = '/foo/bar',
                        actual;

                    // when
                    actual = parseUri(expected);

                    // then
                    expect(actual.path).to.equal(expected);
                    expect(actual.relativePath).to.equal(expected);
                });

                it('should return a queryString and query object if a query string exists', function () {
                    // given
                    var expectedPath = '/foo/bar',
                        expectedQueryString = 'foo=bar&hello=world',
                        expectedQuery = {
                            foo: 'bar',
                            hello: 'world'
                        },
                        path = expectedPath.concat('?', expectedQueryString),
                        actual;

                    // when
                    actual = parseUri(path);

                    // then
                    expect(actual.path).to.equal(expectedPath);
                    expect(actual.relativePath).to.equal(path);
                    expect(actual.queryString).to.equal(expectedQueryString);
                    expect(actual.query.foo).to.equal(expectedQuery.foo);
                    expect(actual.query.hello).to.equal(expectedQuery.hello);
                });

                it('should return a hash if one exists', function () {
                    // given
                    var expectedPath = '/foo/bar',
                        expectedHash = 'tick-tock',
                        path = expectedPath.concat('#', expectedHash),
                        actual;

                    // when
                    actual = parseUri(path);

                    // then
                    expect(actual.path).to.equal(expectedPath);
                    expect(actual.relativePath).to.equal(path);
                    expect(actual.hash).to.equal(expectedHash);
                });
            });

            describe('when a full path is parsed', function () {
                it('should return a uri split into parts', function () {
                    // given
                    var path = 'http://andy:pass@localhost:3000/foo/bar?foo=bar&hello=world#hasher',
                        actual;

                    // when
                    actual = parseUri(path);

                    // then
                    expect(actual.path).to.equal('/foo/bar');
                    expect(actual.relativePath).to.equal('/foo/bar?foo=bar&hello=world#hasher');
                    expect(actual.queryString).to.equal('foo=bar&hello=world');
                    expect(actual.query.foo).to.equal('bar');
                    expect(actual.query.hello).to.equal('world');
                    expect(actual.hash).to.equal('hasher');
                    expect(actual.hostName).to.equal('localhost');
                    expect(actual.host).to.equal('localhost:3000');
                    expect(actual.origin).to.equal('http://localhost:3000');
                    expect(actual.authority).to.equal('andy:pass@localhost:3000');
                    expect(actual.user).to.equal('andy');
                    expect(actual.userAndPassword).to.equal('andy:pass');
                    expect(actual.password).to.equal('pass');
                    expect(actual.source).to.equal(path);
                    expect(actual.protocol).to.equal('http');
                    expect(actual.port).to.equal(3000);
                    expect(actual.directory).to.equal('/foo/bar');
                });
            });

            describe('when the path includes an extension', function () {
                it('should set the filename part', function () {
                    // given
                    var path = '/foo/bar.htm',
                        actual;

                    // when
                    actual = parseUri(path);

                    // then
                    expect(actual.path).to.equal('/foo/bar.htm');
                    expect(actual.directory).to.equal('/foo/');
                    expect(actual.file).to.equal('bar.htm');
                });
            });

        }); // /uriHelper.parseUri
    }
});
