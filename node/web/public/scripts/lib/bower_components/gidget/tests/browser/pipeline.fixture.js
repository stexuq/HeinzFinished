/*jshint unused: false*/
Hilary.scope('gidget-tests').register({
    name: 'pipeline.fixture',
    dependencies: ['describe', 'it', 'expect', 'xdescribe', 'xit', 'async'],
    factory: function (describe, it, expect, xdescribe, xit, async) {
        'use strict';

        describe('Gidget DefaultRouteEngine pipelines', function () {

            describe('when before.routeResolution has a registered handler', function () {

                it('should pass the path into the handler', function (done) {
                    // given
                    var sutPath = '/pipeline/before/routeResolution/path';

                    Gidget.Bootstrapper(null, {
                        composeLifecycle: function (err, gidgetApp, pipeline) {
                            pipeline.before.routeResolution(function (err, req) {
                                if (req.uri.path === sutPath) {
                                    // then
                                    expect(req.uri.path).to.equal(sutPath);
                                    gidgetApp.routeEngine.dispose();
                                    done();
                                }
                            });
                        },
                        composeRoutes: function (err, gidgetApp) {
                            var controller = new Gidget.GidgetModule();
                            controller.get[sutPath] = function (err, req) {

                            };
                            gidgetApp.registerModule(controller);
                        },
                        onComposed: function (err, gidgetApp) {
                            // when
                            gidgetApp.routeEngine.navigate(sutPath, null, false);
                        }
                    });
                });

                it('should be able to affect the path', function (done) {
                    // given
                    var sutPath = '/pipeline/before/routeResolution/path/affect',
                        affectedPath = '/pipeline/before/routeResolution/path/affected';

                    Gidget.Bootstrapper(null, {
                        composeLifecycle: function (err, gidgetApp, pipeline) {
                            pipeline.before.routeResolution(function (err, req, next) {
                                if (req.uri.path === sutPath) {
                                    req.uri.path = affectedPath;
                                }
                                next(err, req);
                            });
                        },
                        composeRoutes: function (err, gidgetApp) {
                            var controller = new Gidget.GidgetModule();
                            controller.get[affectedPath] = function (err, req) {
                                gidgetApp.routeEngine.dispose();
                                done();
                            };
                            gidgetApp.registerModule(controller);
                        },
                        onComposed: function (err, gidgetApp) {
                            // when
                            gidgetApp.routeEngine.navigate(sutPath, null, false);
                        }
                    });
                });

            }); // /before.routeResolution

            describe('when after.routeResolution has a registered handler', function () {
                it('should pass the request into the handler', function (done) {
                    // given
                    var sutPath = '/pipeline/after/routeResolution/path';

                    Gidget.Bootstrapper(null, {
                        composeLifecycle: function (err, gidgetApp, pipeline) {
                            pipeline.after.routeResolution(function (err, req) {
                                if (req.uri.path === sutPath) {
                                    // then
                                    expect(req.route.source).to.equal(sutPath);
                                    gidgetApp.routeEngine.dispose();
                                    done();
                                }
                            });
                        },
                        composeRoutes: function (err, gidgetApp) {
                            var controller = new Gidget.GidgetModule();
                            controller.get[sutPath] = function (err, req) {

                            };
                            gidgetApp.registerModule(controller);
                        },
                        onComposed: function (err, gidgetApp) {
                            // when
                            gidgetApp.routeEngine.navigate(sutPath, null, false);
                        }
                    });
                });
            }); // /after.routeResolution

            describe('when before.routeExecution has a registered handler', function () {
                it('should be able to modify the params', function (done) {
                    // given
                    var sutPath = '/pipeline/before/routeExecution/params';

                    Gidget.Bootstrapper(null, {
                        composeLifecycle: function (err, gidgetApp, pipeline) {
                            pipeline.before.routeExecution(function (err, req, next) {
                                if (req.uri.path === sutPath) {
                                    req.params = { foo: 'bar' };
                                }

                                next(err, req);
                            });
                        },
                        composeRoutes: function (err, gidgetApp) {
                            var controller = new Gidget.GidgetModule();
                            controller.get[sutPath] = function (err, req) {
                                expect(req.params.foo).to.equal('bar');
                                gidgetApp.routeEngine.dispose();
                                done();
                            };
                            gidgetApp.registerModule(controller);
                        },
                        onComposed: function (err, gidgetApp) {
                            // when
                            gidgetApp.routeEngine.navigate(sutPath, null, false);
                        }
                    });
                });
            }); // /before.routeExecution

            describe('when after.routeExecution has a registered handler', function () {
                it('should receive the request as passed by the route handler', function (done) {
                    // given
                    var sutPath = '/pipeline/after/routeExecution';

                    Gidget.Bootstrapper(null, {
                        composeLifecycle: function (err, gidgetApp, pipeline) {
                            pipeline.after.routeExecution(function (err, req) {
                                if (req.uri.path === sutPath) {
                                    expect(req.foo).to.equal('bar');
                                    gidgetApp.routeEngine.dispose();
                                    done();
                                }
                            });
                        },
                        composeRoutes: function (err, gidgetApp) {
                            var controller = new Gidget.GidgetModule();
                            controller.get[sutPath] = function (err, req, next) {
                                req.foo = 'bar';
                                next(null, req);
                            };
                            gidgetApp.registerModule(controller);
                        },
                        onComposed: function (err, gidgetApp) {
                            // when
                            gidgetApp.routeEngine.navigate(sutPath, null, false);
                        }
                    });
                });

                it('should receive an error if one is passed earlier in the pipeline', function (done) {
                    // given
                    var sutPath = '/pipeline/after/routeExecution/err';

                    Gidget.Bootstrapper(null, {
                        composeLifecycle: function (err, gidgetApp, pipeline) {
                            pipeline.after.routeExecution(function (err, req) {
                                if (req.uri.path === sutPath) {
                                    expect(err.status).to.equal(500);
                                    gidgetApp.routeEngine.dispose();
                                    done();
                                }
                            });
                        },
                        composeRoutes: function (err, gidgetApp) {
                            var controller = new Gidget.GidgetModule();
                            controller.get[sutPath] = function (err, req, next) {
                                next({ status: 500 }, req);
                            };
                            gidgetApp.registerModule(controller);
                        },
                        onComposed: function (err, gidgetApp) {
                            // when
                            gidgetApp.routeEngine.navigate(sutPath, null, false);
                        }
                    });
                });
            }); // /after.routeExecution

            describe('when on.error has a registered handler', function () {
                it('should get called, when an error event is triggered', function (done) {
                    // given
                    var sutPath = '/pipeline/on/errror';

                    Gidget.Bootstrapper(null, {
                        composeLifecycle: function (err, gidgetApp, pipeline) {
                            pipeline.before.routeResolution(function (err, req, next) {
                                next({ status: 500, path: sutPath });
                            });

                            pipeline.on.error(function (err) {
                                if (err.data.path === sutPath) {
                                    expect(err.data.status).to.equal(500);
                                    gidgetApp.routeEngine.dispose();
                                    done();
                                }
                            });
                        },
                        composeRoutes: function (err, gidgetApp) {
                            var controller = new Gidget.GidgetModule();
                            controller.get[sutPath] = function (err, req, next) {
                                next(null, req);
                            };
                            gidgetApp.registerModule(controller);
                        },
                        onComposed: function (err, gidgetApp) {
                            // when
                            gidgetApp.routeEngine.navigate(sutPath, null, false);
                        }
                    });
                });
            }); // /on.error

            describe('when the once property is true on an event', function () {

                var onceSpec = function (sutPath, eventFactory, assert) {
                    // given
                    var count = 0;

                    Gidget.Bootstrapper(null, {
                        composeLifecycle: function (err, gidgetApp, pipeline) {
                            var handler = new gidgetApp.PipelineEvent({
                                eventHandler: function (err, req) {
                                    if (req.uri.path === sutPath) {
                                        count++;
                                    }
                                },
                                once: true
                            });
                            eventFactory(pipeline)(handler);
                        },
                        composeRoutes: function (err, gidgetApp) {
                            var controller = new Gidget.GidgetModule();
                            controller.get[sutPath] = function (err, req) {

                            };
                            gidgetApp.registerModule(controller);
                        },
                        onComposed: function (err, gidgetApp) {
                            // given
                            gidgetApp.routeEngine.get(sutPath, function (err) {
                                if (err) {
                                    assert(err);
                                    return;
                                }
                                gidgetApp.routeEngine.get(sutPath, function (err) {
                                    if (err) {
                                        assert(err);
                                        return;
                                    }
                                    gidgetApp.routeEngine.get(sutPath, function (err, results) {
                                        assert(err, results, count);
                                    });
                                });
                            });
                        }
                    });
                };

                it('should remove the event from the pipeline (pipeline.before.routeResolution)', function (done) {
                    onceSpec(
                        '/pipeline/once/before/routeResolution',
                        function (pipeline) { return pipeline.before.routeResolution; },
                        function (err, results, count) {
                            // then
                            expect(err).to.equal(null);
                            expect(count).to.equal(1);
                            done();
                        }
                    );
                });

                it('should remove the event from the pipeline (pipeline.after.routeResolution)', function (done) {
                    onceSpec(
                        '/pipeline/once/after/routeResolution',
                        function (pipeline) { return pipeline.after.routeResolution; },
                        function (err, results, count) {
                            // then
                            expect(count).to.equal(1);
                            done();
                        }
                    );
                });

                it('should remove the event from the pipeline (pipeline.before.routeExecution)', function (done) {
                    onceSpec(
                        '/pipeline/once/before/routeExecution',
                        function (pipeline) { return pipeline.before.routeExecution; },
                        function (err, results, count) {
                            // then
                            expect(count).to.equal(1);
                            done();
                        }
                    );
                });

                it('should remove the event from the pipeline (pipeline.after.routeExecution)', function (done) {
                    onceSpec(
                        '/pipeline/once/after/routeExecution',
                        function (pipeline) { return pipeline.after.routeExecution; },
                        function (err, results, count) {
                            // then
                            expect(count).to.equal(1);
                            done();
                        }
                    );
                });
            });

            describe('when the remove condition is declared on an event', function () {
                var removeSpec = function (sutPath, eventFactory, assert, remove) {
                    // given
                    var count = 0;

                    Gidget.Bootstrapper(null, {
                        composeLifecycle: function (err, gidgetApp, pipeline) {
                            var handler = new gidgetApp.PipelineEvent({
                                eventHandler: function (err, req) {
                                    if (req.uri.path === sutPath) {
                                        count++;
                                    }
                                },
                                // remove: when
                                remove: function (err, req) {
                                    if (req.uri.path === sutPath) {
                                        return remove;
                                    }
                                }
                            });
                            eventFactory(pipeline)(handler);
                        },
                        composeRoutes: function (err, gidgetApp) {
                            var controller = new Gidget.GidgetModule();
                            controller.get[sutPath] = function (err, req) {

                            };
                            gidgetApp.registerModule(controller);
                        },
                        onComposed: function (err, gidgetApp) {
                            // given
                            gidgetApp.routeEngine.get(sutPath, function (err) {
                                if (err) {
                                    assert(err);
                                    return;
                                }
                                gidgetApp.routeEngine.get(sutPath, function (err) {
                                    if (err) {
                                        assert(err);
                                        return;
                                    }
                                    gidgetApp.routeEngine.get(sutPath, function (err, results) {
                                        assert(err, results, count);
                                    });
                                });
                            });
                        }
                    });
                };

                it('should remove the event from the pipeline (pipeline.before.routeResolution)', function (done) {
                    removeSpec(
                        '/pipeline/remove/before/routeResolution',
                        function (pipeline) { return pipeline.before.routeResolution; },
                        function (err, results, count) {
                            // then
                            expect(err).to.equal(null);
                            expect(count).to.equal(1);
                            done();
                        },
                        true
                    );
                });

                it('should remove the event from the pipeline (pipeline.after.routeResolution)', function (done) {
                    removeSpec(
                        '/pipeline/remove/after/routeResolution',
                        function (pipeline) { return pipeline.after.routeResolution; },
                        function (err, results, count) {
                            // then
                            expect(count).to.equal(1);
                            done();
                        },
                        true
                    );
                });

                it('should remove the event from the pipeline (pipeline.before.routeExecution)', function (done) {
                    removeSpec(
                        '/pipeline/remove/before/routeExecution',
                        function (pipeline) { return pipeline.before.routeExecution; },
                        function (err, results, count) {
                            // then
                            expect(count).to.equal(1);
                            done();
                        },
                        true
                    );
                });

                it('should remove the event from the pipeline (pipeline.after.routeExecution)', function (done) {
                    removeSpec(
                        '/pipeline/remove/after/routeExecution',
                        function (pipeline) { return pipeline.after.routeExecution; },
                        function (err, results, count) {
                            // then
                            expect(count).to.equal(1);
                            done();
                        },
                        true
                    );
                });

                it('should NOT remove the event from the pipeline when remove does not return true', function (done) {
                    removeSpec(
                        '/pipeline/remove/after/routeExecution',
                        function (pipeline) { return pipeline.after.routeExecution; },
                        function (err, results, count) {
                            // then
                            expect(count).to.equal(3);
                            done();
                        },
                        false
                    );
                });
            });

        }); // pipelines
    }
});
