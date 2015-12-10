/*jshint unused: false*/
Hilary.scope('gidget-tests').register({
    name: 'DefaultRouteEngine.fixture',
    dependencies: ['describe', 'it', 'expect', 'xdescribe', 'xit'],
    factory: function (describe, it, expect, xdescribe, xit) {
        'use strict';

        describe('Gidget\'s DefaultRouteEngine', function () {

            describe('when a route is resolved', function () {
                it('should return a GidgetResponse', function (done) {
                    // given
                    var path = '/register/callback/GidgetResponse/:response',
                        expected = '/register/callback/GidgetResponse/foo';

                    Gidget.Bootstrapper(null, {
                        composeRoutes: function (err, gidgetApp) {
                            var controller = new Gidget.GidgetModule();
                            controller.get[path] = function (err, res) {
                                // then
                                expect(res.uri.path).to.equal(expected);
                                expect(res.route.source).to.equal(path);
                                expect(res.route.verb).to.equal('get');
                                expect(res.params.response).to.equal('foo');
                                expect(typeof res.callback).to.equal('function');

                                gidgetApp.routeEngine.dispose();
                                done();
                            };
                            gidgetApp.registerModule(controller);
                        },
                        onComposed: function (err, gidgetApp) {
                            // when
                            gidgetApp.routeEngine.navigate(expected, null, false);
                        }
                    });
                });
            });

            describe('when a route is registered with a parameterless function', function () {
                it('should be navigable', function (done) {
                    // given
                    Gidget.Bootstrapper(null, {
                        composeRoutes: function (err, gidgetApp) {
                            var controller = new Gidget.GidgetModule();
                            controller.get['/register/parameterless/callback'] = function () {
                                // then
                                gidgetApp.routeEngine.dispose();
                                done();
                            };
                            gidgetApp.registerModule(controller);
                        },
                        onComposed: function (err, gidgetApp) {
                            // when
                            gidgetApp.routeEngine.navigate('/register/parameterless/callback', null, false);
                        }
                    });
                });
            }); // /route register()

            describe('when a route is registered with a function that accepts 2 arguments', function () {
                it('should pass in a request object', function (done) {
                    // given
                    var expected = '/register/twoparam/callback/response';

                    Gidget.Bootstrapper(null, {
                        composeRoutes: function (err, gidgetApp) {
                            var controller = new Gidget.GidgetModule();
                            controller.get[expected] = function (err, req) {
                                // then
                                expect(err).to.equal(null);
                                expect(req.uri.path).to.equal(expected);
                                gidgetApp.routeEngine.dispose();
                                done();
                            };
                            gidgetApp.registerModule(controller);
                        },
                        onComposed: function (err, gidgetApp) {
                            // when
                            gidgetApp.routeEngine.navigate(expected, null, false);
                        }
                    });
                });

                it('should pass in an error, if an error is thrown earlier in the pipeline', function (done) {
                    // given
                    var expected = '/register/twoparam/callback/error';

                    Gidget.Bootstrapper(null, {
                        composeRoutes: function (err, gidgetApp) {
                            var controller = new Gidget.GidgetModule();
                            controller.get[expected] = new Gidget.GidgetRoute({
                                routeHandler: function (err, req) {
                                   // then
                                   expect(err.status).to.equal(500);
                                   gidgetApp.routeEngine.dispose();
                                   done();
                               },
                               before: function (err, res, next) {
                                   next({ status: 500 });
                               }
                            });

                            gidgetApp.registerModule(controller);
                        },
                        onComposed: function (err, gidgetApp) {
                            // when
                            gidgetApp.routeEngine.navigate(expected, null, false);
                        }
                    });
                });
            }); // /route register(err, res)

            describe('when a route is registered with a function that accepts 3 arguments', function () {
                it('should pass in a request object', function (done) {
                    // given
                    var expected = '/register/threeparam/callback/response';

                    Gidget.Bootstrapper(null, {
                        composeRoutes: function (err, gidgetApp) {
                            var controller = new Gidget.GidgetModule();
                            controller.get[expected] = function (err, req, next) {
                                // then
                                expect(err).to.equal(null);
                                expect(req.uri.path).to.equal(expected);
                                gidgetApp.routeEngine.dispose();
                                done();
                            };
                            gidgetApp.registerModule(controller);
                        },
                        onComposed: function (err, gidgetApp) {
                            // when
                            gidgetApp.routeEngine.navigate(expected, null, false);
                        }
                    });
                });

                it('should pass in an error, if an error is thrown earlier in the pipeline', function (done) {
                    // given
                    var expected = '/register/threeparam/callback/error';

                    Gidget.Bootstrapper(null, {
                        composeRoutes: function (err, gidgetApp) {
                            var controller = new Gidget.GidgetModule();
                            controller.get[expected] = new Gidget.GidgetRoute({
                                before: function (err, res, next) {
                                    next({ status: 500 });
                                },
                                routeHandler: function (err, req, next) {
                                   // then
                                   expect(err.status).to.equal(500);
                                   gidgetApp.routeEngine.dispose();
                                   done();
                               }
                            });

                            gidgetApp.registerModule(controller);
                        },
                        onComposed: function (err, gidgetApp) {
                            // when
                            gidgetApp.routeEngine.navigate(expected, null, false);
                        }
                    });
                });

                it('should allow the route to pass in an error to the next phase of the pipeline', function (done) {
                    // given
                    var expected = '/register/threeparam/callback/after/error';

                    Gidget.Bootstrapper(null, {
                        composeRoutes: function (err, gidgetApp) {
                            var controller = new Gidget.GidgetModule();
                            controller.get[expected] = new Gidget.GidgetRoute({
                                routeHandler: function (err, req, next) {
                                   next({ status: 500 });
                               },
                               after: function (err, res, next) {
                                   // then
                                   expect(err.status).to.equal(500);
                                   gidgetApp.routeEngine.dispose();
                                   done();
                               }
                            });

                            gidgetApp.registerModule(controller);
                        },
                        onComposed: function (err, gidgetApp) {
                            // when
                            gidgetApp.routeEngine.navigate(expected, null, false);
                        }
                    });
                });

                it('should allow the route to affect the request object', function (done) {
                    // given
                    var expected = '/register/threeparam/callback/after/response';

                    Gidget.Bootstrapper(null, {
                        composeRoutes: function (err, gidgetApp) {
                            var controller = new Gidget.GidgetModule();
                            controller.get[expected] = new Gidget.GidgetRoute({
                                routeHandler: function (err, res, next) {
                                   res.foo = expected;
                                   next(err, res);
                               },
                               after: function (err, res, next) {
                                   // then
                                   expect(res.foo).to.equal(expected);
                                   gidgetApp.routeEngine.dispose();
                                   done();
                               }
                            });

                            gidgetApp.registerModule(controller);
                        },
                        onComposed: function (err, gidgetApp) {
                            // when
                            gidgetApp.routeEngine.navigate(expected, null, false);
                        }
                    });
                });
            }); // /route register(err, res, next)

            describe('when a route that has parameters is registered', function () {
                it('should pass in the parameters by name on the request object', function (done) {
                    // given
                    var expected = '/register/params/:param/callback/:foo';

                    Gidget.Bootstrapper(null, {
                        composeRoutes: function (err, gidgetApp) {
                            var controller = new Gidget.GidgetModule();
                            controller.get[expected] = function (err, req) {
                                // then
                                expect(err).to.equal(null);
                                expect(req.params.param).to.equal('test1');
                                expect(req.params.foo).to.equal('test2');
                                gidgetApp.routeEngine.dispose();
                                done();
                            };
                            gidgetApp.registerModule(controller);
                        },
                        onComposed: function (err, gidgetApp) {
                            // when
                            gidgetApp.routeEngine.navigate('/register/params/test1/callback/test2', null, false);
                        }
                    });
                });

                it('should pass in the parameters as a splat array on the request object', function (done) {
                    // given
                    var expected = '/register/params/:param/splat/:foo';

                    Gidget.Bootstrapper(null, {
                        composeRoutes: function (err, gidgetApp) {
                            var controller = new Gidget.GidgetModule();
                            controller.get[expected] = function (err, req) {
                                // then
                                expect(err).to.equal(null);
                                expect(req.params.splat[0]).to.equal('test1');
                                expect(req.params.splat[1]).to.equal('test2');
                                gidgetApp.routeEngine.dispose();
                                done();
                            };
                            gidgetApp.registerModule(controller);
                        },
                        onComposed: function (err, gidgetApp) {
                            // when
                            gidgetApp.routeEngine.navigate('/register/params/test1/splat/test2', null, false);
                        }
                    });
                });
            }); // /route /{params}

            describe('when a route that has a hash is registered', function () {
                it('should be accessable via uri.hash', function (done) {
                    // given
                    var expected = '/register/params/:param/hash/:foo';

                    Gidget.Bootstrapper(null, {
                        composeRoutes: function (err, gidgetApp) {
                            var controller = new Gidget.GidgetModule();
                            controller.get[expected] = function (err, req) {
                                // then
                                expect(err).to.equal(null);
                                expect(req.params.splat[0]).to.equal('test1');
                                expect(req.params.splat[1]).to.equal('test2');
                                expect(req.uri.hash).to.equal('heading');
                                gidgetApp.routeEngine.dispose();
                                done();
                            };
                            gidgetApp.registerModule(controller);
                        },
                        onComposed: function (err, gidgetApp) {
                            // when
                            gidgetApp.routeEngine.navigate('/register/params/test1/hash/test2#heading', null, false);
                        }
                    });
                });
            });

            describe('when a route that has a query string is registered', function () {
                it('should put the query string on the uri object', function (done) {
                    // given
                    var expected = '/register/params/:param/query-hash/:foo';

                    Gidget.Bootstrapper(null, {
                        composeRoutes: function (err, gidgetApp) {
                            var controller = new Gidget.GidgetModule();
                            controller.get[expected] = function (err, req) {
                                // then
                                expect(err).to.equal(null);
                                expect(req.params.splat[0]).to.equal('test1');
                                expect(req.params.splat[1]).to.equal('test2');
                                expect(req.uri.queryString).to.equal('foo=bar&hello=world');
                                expect(req.uri.query.foo).to.equal('bar');
                                expect(req.uri.query.hello).to.equal('world');
                                gidgetApp.routeEngine.dispose();
                                done();
                            };
                            gidgetApp.registerModule(controller);
                        },
                        onComposed: function (err, gidgetApp) {
                            // when
                            gidgetApp.routeEngine.navigate('/register/params/test1/query-hash/test2?foo=bar&hello=world', null, false);
                        }
                    });
                });
            });

            describe('when a route that has a query string and a hash is registered', function () {
                it('should put the hash and query string on the uri object', function (done) {
                    // given
                    var expected = '/register/params/:param/query-hash/:foo';

                    Gidget.Bootstrapper(null, {
                        composeRoutes: function (err, gidgetApp) {
                            var controller = new Gidget.GidgetModule();
                            controller.get[expected] = function (err, req) {
                                // then
                                expect(err).to.equal(null);
                                expect(req.params.splat[0]).to.equal('test1');
                                expect(req.params.splat[1]).to.equal('test2');
                                expect(req.uri.hash).to.equal('heading');
                                expect(req.uri.query.foo).to.equal('bar');
                                expect(req.uri.query.hello).to.equal('world');
                                gidgetApp.routeEngine.dispose();
                                done();
                            };
                            gidgetApp.registerModule(controller);
                        },
                        onComposed: function (err, gidgetApp) {
                            // when
                            gidgetApp.routeEngine.navigate('/register/params/test1/query-hash/test2?foo=bar&hello=world#heading', null, false);
                        }
                    });
                });
            });

            describe('when a route sets the title on the request object', function () {
                it('should update the browser history with that title', function (done) {
                    // given
                    var expected = '/register/title',
                        expectedTitle = 'new title';

                    Gidget.Bootstrapper(null, {
                        composeRoutes: function (err, gidgetApp) {
                            var controller = new Gidget.GidgetModule();
                            controller.get[expected] = function (err, req) {
                                req.title = expectedTitle;
                            };
                            gidgetApp.registerModule(controller);
                        },
                        onComposed: function (err, gidgetApp) {
                            // when
                            gidgetApp.routeEngine.navigate({
                                path: expected,
                                callback: function () {
                                    // then
                                    expect(document.title).to.equal(expectedTitle);
                                    done();
                                }
                            });
                        }
                    });
                });
            });

            describe('when navigate is called with title set on the data object', function () {
                it('should update the browser history with that title', function (done) {
                    // given
                    var expected = '/register/data/title',
                        expectedTitle = 'new data title';

                    Gidget.Bootstrapper(null, {
                        composeRoutes: function (err, gidgetApp) {
                            var controller = new Gidget.GidgetModule();
                            controller.get[expected] = function (err, req) { };
                            gidgetApp.registerModule(controller);
                        },
                        onComposed: function (err, gidgetApp) {
                            // when
                            gidgetApp.routeEngine.navigate({
                                path: expected,
                                data: { title: expectedTitle },
                                callback: function () {
                                    // then
                                    expect(document.title).to.equal(expectedTitle);
                                    done();
                                }
                            });
                        }
                    });
                });
            });

            describe('when updateHistory is called with title set on the data object', function () {
                it('should update the browser history with that title', function (done) {
                    // given
                    var expected = '/set/history/title',
                        expectedTitle = 'new history title';

                    Gidget.Bootstrapper(null, {
                        onComposed: function (err, gidgetApp) {
                            // when
                            gidgetApp.routeEngine.updateHistory(expected, { title: expectedTitle });

                            // then
                            expect(document.title).to.equal(expectedTitle);
                            done();
                        }
                    });
                });
            });

        }); // /DefaultRouteEngine
    }
});
