Hilary.scope('gidget-tests').register({
    name: 'GidgetModule.fixture',
    dependencies: ['describe', 'it', 'expect'],
    factory: function (describe, it, expect) {
        'use strict';

        describe('GidgetModule', function () {

            describe('when get is defined using NancyFx formatting', function () {
                it('should be resolved when the route is hit', function (done) {
                    // given
                    var expected = '/GidgetModule/Nancy/get';

                    Gidget.Bootstrapper(null, {
                        composeRoutes: function (err, gidgetApp) {
                            var controller = new Gidget.GidgetModule();
                            controller.get[expected] = function (err, res) {
                                // then
                                expect(res.uri.path).to.equal(expected);
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

            describe('when post is defined using NancyFx formatting', function () {
                it('should be resolved when the route is hit', function (done) {
                    // given
                    var expected = '/GidgetModule/Nancy/post';

                    Gidget.Bootstrapper(null, {
                        composeRoutes: function (err, gidgetApp) {
                            var controller = new Gidget.GidgetModule();
                            controller.post[expected] = function (err, res) {
                                // then
                                expect(res.uri.path).to.equal(expected);
                                gidgetApp.routeEngine.dispose();
                                done();
                            };
                            gidgetApp.registerModule(controller);
                        },
                        onComposed: function (err, gidgetApp) {
                            // when
                            gidgetApp.routeEngine.post(expected, null, false);
                        }
                    });
                });
            });

            describe('when post is defined using express formatting', function () {
                it('should be resolved when the route is hit', function (done) {
                    // given
                    var expected = '/GidgetModule/express/post';

                    Gidget.Bootstrapper(null, {
                        composeRoutes: function (err, gidgetApp) {
                            var controller = new Gidget.GidgetModule();
                            controller.register.post(expected, function (err, res) {
                                // then
                                expect(res.uri.path).to.equal(expected);
                                gidgetApp.routeEngine.dispose();
                                done();
                            });
                            gidgetApp.registerModule(controller);
                        },
                        onComposed: function (err, gidgetApp) {
                            // when
                            gidgetApp.routeEngine.post(expected, null, false);
                        }
                    });
                });
            });

            describe('when put is defined using NancyFx formatting', function () {
                it('should be resolved when the route is hit', function (done) {
                    // given
                    var expected = '/GidgetModule/Nancy/put';

                    Gidget.Bootstrapper(null, {
                        composeRoutes: function (err, gidgetApp) {
                            var controller = new Gidget.GidgetModule();
                            controller.put[expected] = function (err, res) {
                                // then
                                expect(res.uri.path).to.equal(expected);
                                gidgetApp.routeEngine.dispose();
                                done();
                            };
                            gidgetApp.registerModule(controller);
                        },
                        onComposed: function (err, gidgetApp) {
                            // when
                            gidgetApp.routeEngine.put(expected, null, false);
                        }
                    });
                });
            });

            describe('when put is defined using express formatting', function () {
                it('should be resolved when the route is hit', function (done) {
                    // given
                    var expected = '/GidgetModule/express/put';

                    Gidget.Bootstrapper(null, {
                        composeRoutes: function (err, gidgetApp) {
                            var controller = new Gidget.GidgetModule();
                            controller.register.put(expected, function (err, res) {
                                // then
                                expect(res.uri.path).to.equal(expected);
                                gidgetApp.routeEngine.dispose();
                                done();
                            });
                            gidgetApp.registerModule(controller);
                        },
                        onComposed: function (err, gidgetApp) {
                            // when
                            gidgetApp.routeEngine.put(expected, null, false);
                        }
                    });
                });
            });

            describe('when put is defined using NancyFx formatting', function () {
                it('should be resolved when the route is hit', function (done) {
                    // given
                    var expected = '/GidgetModule/Nancy/del';

                    Gidget.Bootstrapper(null, {
                        composeRoutes: function (err, gidgetApp) {
                            var controller = new Gidget.GidgetModule();
                            controller.del[expected] = function (err, res) {
                                // then
                                expect(res.uri.path).to.equal(expected);
                                gidgetApp.routeEngine.dispose();
                                done();
                            };
                            gidgetApp.registerModule(controller);
                        },
                        onComposed: function (err, gidgetApp) {
                            // when
                            gidgetApp.routeEngine.del(expected, null, false);
                        }
                    });
                });
            });

            describe('when del is defined using express formatting', function () {
                it('should be resolved when the route is hit', function (done) {
                    // given
                    var expected = '/GidgetModule/express/del';

                    Gidget.Bootstrapper(null, {
                        composeRoutes: function (err, gidgetApp) {
                            var controller = new Gidget.GidgetModule();
                            controller.register.del(expected, function (err, res) {
                                // then
                                expect(res.uri.path).to.equal(expected);
                                gidgetApp.routeEngine.dispose();
                                done();
                            });
                            gidgetApp.registerModule(controller);
                        },
                        onComposed: function (err, gidgetApp) {
                            // when
                            gidgetApp.routeEngine.del(expected, null, false);
                        }
                    });
                });
            });

        });
    }
});
