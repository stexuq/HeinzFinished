Hilary.scope('gidget-tests').register({
    name: 'BaseRouteEngine.fixture',
    dependencies: ['describe', 'it', 'expect'],
    factory: function (describe, it, expect) {
        'use strict';

        describe('Gidget\'s BaseRouteEngine', function () {
            describe('when routeEngine.get is called', function () {
                it('should execute the matching route', function (done) {
                    // given
                    var expected = '/base/router/get';

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
                            gidgetApp.routeEngine.get(expected);
                        }
                    });
                });
            }); // /get

            describe('when routeEngine.post is called', function () {
                it('should execute the matching route', function (done) {
                    // given
                    var expected = '/base/router/post';

                    Gidget.Bootstrapper(null, {
                        composeRoutes: function (err, gidgetApp) {
                            var controller = new Gidget.GidgetModule();
                            controller.post[expected] = function (err, req) {
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
                            gidgetApp.routeEngine.post(expected);
                        }
                    });
                });

                it('should be able to pass a payload to the route handler', function (done) {
                    // given
                    var expectedRoute = '/base/router/post/payload',
                        expectedPayload = {
                            id: 42
                        };

                    Gidget.Bootstrapper(null, {
                        composeRoutes: function (err, gidgetApp) {
                            var controller = new Gidget.GidgetModule();
                            controller.post[expectedRoute] = function (err, req) {
                                // then
                                expect(err).to.equal(null);
                                expect(req.uri.path).to.equal(expectedRoute);
                                expect(req.payload.id).to.equal(expectedPayload.id);
                                gidgetApp.routeEngine.dispose();
                                done();
                            };
                            gidgetApp.registerModule(controller);
                        },
                        onComposed: function (err, gidgetApp) {
                            // when
                            gidgetApp.routeEngine.post(expectedRoute, expectedPayload);
                        }
                    });
                });
            }); // /post

            describe('when routeEngine.put is called', function () {
                it('should execute the matching route', function (done) {
                    // given
                    var expected = '/base/router/put';

                    Gidget.Bootstrapper(null, {
                        composeRoutes: function (err, gidgetApp) {
                            var controller = new Gidget.GidgetModule();
                            controller.put[expected] = function (err, req) {
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
                            gidgetApp.routeEngine.put(expected);
                        }
                    });
                });

                it('should be able to pass a payload to the route handler', function (done) {
                    // given
                    var expectedRoute = '/base/router/put/payload',
                        expectedPayload = {
                            id: 42
                        };

                    Gidget.Bootstrapper(null, {
                        composeRoutes: function (err, gidgetApp) {
                            var controller = new Gidget.GidgetModule();
                            controller.put[expectedRoute] = function (err, req) {
                                // then
                                expect(err).to.equal(null);
                                expect(req.uri.path).to.equal(expectedRoute);
                                expect(req.payload.id).to.equal(expectedPayload.id);
                                gidgetApp.routeEngine.dispose();
                                done();
                            };
                            gidgetApp.registerModule(controller);
                        },
                        onComposed: function (err, gidgetApp) {
                            // when
                            gidgetApp.routeEngine.put(expectedRoute, expectedPayload);
                        }
                    });
                });
            }); // /put

            describe('when routeEngine.patch is called', function () {
                it('should execute the matching route', function (done) {
                    // given
                    var expected = '/base/router/patch';

                    Gidget.Bootstrapper(null, {
                        composeRoutes: function (err, gidgetApp) {
                            var controller = new Gidget.GidgetModule();
                            controller.patch[expected] = function (err, req) {
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
                            gidgetApp.routeEngine.patch(expected);
                        }
                    });
                });

                it('should be able to pass a payload to the route handler', function (done) {
                    // given
                    var expectedRoute = '/base/router/patch/payload',
                        expectedPayload = {
                            id: 42
                        };

                    Gidget.Bootstrapper(null, {
                        composeRoutes: function (err, gidgetApp) {
                            var controller = new Gidget.GidgetModule();
                            controller.patch[expectedRoute] = function (err, req) {
                                // then
                                expect(err).to.equal(null);
                                expect(req.uri.path).to.equal(expectedRoute);
                                expect(req.payload.id).to.equal(expectedPayload.id);
                                gidgetApp.routeEngine.dispose();
                                done();
                            };
                            gidgetApp.registerModule(controller);
                        },
                        onComposed: function (err, gidgetApp) {
                            // when
                            gidgetApp.routeEngine.patch(expectedRoute, expectedPayload);
                        }
                    });
                });
            }); // /patch

            describe('when routeEngine.del is called', function () {
                it('should execute the matching route', function (done) {
                    // given
                    var expected = '/base/router/del';

                    Gidget.Bootstrapper(null, {
                        composeRoutes: function (err, gidgetApp) {
                            var controller = new Gidget.GidgetModule();
                            controller.del[expected] = function (err, req) {
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
                            gidgetApp.routeEngine.del(expected);
                        }
                    });
                });
            }); // /del
        }); // /'Gidget\'s BaseRouteEngine'
    }
});
