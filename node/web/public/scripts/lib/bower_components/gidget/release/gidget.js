/*! gidget-builder 2015-11-13 */
Hilary.scope("gidget").register({
    name: "IGidget",
    dependencies: [ "Blueprint" ],
    factory: function(Blueprint) {
        "use strict";
        return new Blueprint({
            __blueprintId: "IGidget",
            GidgetModule: "function",
            GidgetRoute: {
                type: "function",
                args: [ "route" ]
            },
            Bootstrapper: {
                type: "function",
                args: [ "scope", "bootstrapper" ]
            }
        });
    }
});

Hilary.scope("gidget").register({
    name: "IGidgetApp",
    dependencies: [ "Blueprint" ],
    factory: function(Blueprint) {
        "use strict";
        return new Blueprint({
            __blueprintId: "IGidgetApp",
            start: "function",
            routeEngine: "object",
            pipeline: "object",
            PipelineEvent: {
                type: "function",
                args: [ "event" ]
            },
            registerModule: {
                type: "function",
                args: [ "gidgetModule" ]
            },
            registerModules: {
                type: "function",
                args: [ "gidgetModules" ]
            }
        });
    }
});

Hilary.scope("gidget").register({
    name: "IGidgetModule",
    dependencies: [ "Blueprint" ],
    factory: function(Blueprint) {
        "use strict";
        return new Blueprint({
            __blueprintId: "IGidgetModule",
            get: "object",
            post: "object",
            put: "object",
            del: "object",
            register: {
                type: "blueprint",
                blueprint: new Blueprint({
                    __blueprintId: "IGidgetModule.register",
                    get: {
                        type: "function",
                        args: [ "routePath", "routeHandler" ]
                    },
                    post: {
                        type: "function",
                        args: [ "routePath", "routeHandler" ]
                    },
                    put: {
                        type: "function",
                        args: [ "routePath", "routeHandler" ]
                    },
                    patch: {
                        type: "function",
                        args: [ "routePath", "routeHandler" ]
                    },
                    del: {
                        type: "function",
                        args: [ "routePath", "routeHandler" ]
                    }
                })
            }
        });
    }
});

Hilary.scope("gidget").register({
    name: "IGidgetRoute",
    dependencies: [ "Blueprint" ],
    factory: function(Blueprint) {
        "use strict";
        return new Blueprint({
            __blueprintId: "IGidgetRoute",
            routeHandler: "function"
        });
    }
});

Hilary.scope("gidget").register({
    name: "IRouteEngine",
    dependencies: [ "Blueprint" ],
    factory: function(Blueprint) {
        "use strict";
        return new Blueprint({
            __blueprintId: "IRouteEngine",
            get: {
                type: "function",
                args: [ "path", "callback" ]
            },
            post: {
                type: "function",
                args: [ "path", "payload", "callback" ]
            },
            put: {
                type: "function",
                args: [ "path", "payload", "callback" ]
            },
            patch: {
                type: "function",
                args: [ "path", "payload", "callback" ]
            },
            del: {
                type: "function",
                args: [ "path", "callback" ]
            },
            navigate: {
                type: "function",
                args: [ "pathOrOptions", "data", "pushStateToHistory" ]
            },
            updateHistory: {
                type: "function",
                args: [ "path", "data" ]
            },
            register: {
                type: "blueprint",
                blueprint: new Blueprint({
                    __blueprintId: "IRouteEngine.register",
                    get: {
                        type: "function",
                        args: [ "path", "callback" ]
                    },
                    post: {
                        type: "function",
                        args: [ "path", "callback" ]
                    },
                    put: {
                        type: "function",
                        args: [ "path", "callback" ]
                    },
                    patch: {
                        type: "function",
                        args: [ "path", "callback" ]
                    },
                    del: {
                        type: "function",
                        args: [ "path", "callback" ]
                    }
                })
            },
            resolveRoute: {
                type: "function",
                args: [ "path", "verb", "payload" ]
            },
            resolveAndExecuteRoute: {
                type: "function",
                args: [ "path", "verb", "callback", "payload" ]
            },
            start: "function",
            dispose: "function",
            pipeline: "object"
        });
    }
});

Hilary.scope("gidget").register({
    name: "locale",
    factory: {
        errors: {
            defaultMessage: "Gidget Error - see err.data",
            requiresArguments: "The {func} function requires arguments {args}",
            pipelineRequiresCallback: "A callback function is required to register a pipeline event",
            parseUriRequiresUriString: "A uriString is required to parse a URI",
            pipelineEventRequiresHandler: "PipelineEvent eventHandler is missing. Did you register an empty PipelineEvent?",
            status404: "Not Found!",
            interfaces: {
                requiresImplementation: "A valid implementation is required to create a new instance of an interface",
                requiresProperty: "The implementation is missing a required property: ",
                requiresArguments: "The implementation of this function requires the arguments: ",
                notAnIRouteEngine: "The router instance that was passed into the RouteEngine constructor does not implement IRouteEngine",
                notAnIGidgetApp: "The gidgetApp instance that were passed into the GidgetApp constructor does not implement IGidgetApp",
                notAnIGidgetModule: "The module that you are trying to register does not implement IGidgetModule",
                missingOptions: "To create a Gidget instance, you must provide the minimum required options"
            }
        }
    }
});

Hilary.scope("gidget").register({
    name: "argumentValidator",
    dependencies: [ "locale", "exceptions" ],
    factory: function(locale, exceptions) {
        "use strict";
        return {
            validate: function(blueprint, argument) {
                var isValid = blueprint.syncSignatureMatches(argument), i;
                if (isValid.result) {
                    return true;
                } else {
                    for (i = 0; i < isValid.errors.length; i += 1) {
                        exceptions.throwArgumentException(isValid.errors[i]);
                    }
                    return isValid;
                }
            }
        };
    }
});

Hilary.scope("gidget").register({
    name: "ExceptionHandler",
    dependencies: [],
    factory: function(onError) {
        "use strict";
        var self = {
            makeException: undefined,
            argumentException: undefined,
            throwArgumentException: undefined,
            notImplementedException: undefined,
            throwNotImplementedException: undefined,
            fetchException: undefined,
            throwFetchException: undefined,
            throwException: undefined,
            "throw": undefined
        }, makeException;
        onError = typeof onError === "function" ? onError : function(exception) {
            console.error(exception);
            throw exception;
        };
        makeException = function(name, message, data) {
            var msg, err;
            if (typeof name === "object" && typeof name.message === "string") {
                msg = name.message;
                err = name;
            } else {
                msg = typeof message === "string" ? message : name;
                err = new Error(msg);
            }
            err.message = msg;
            if (name !== msg) {
                err.name = name;
            }
            if (data) {
                err.data = data;
            }
            return err;
        };
        self.makeException = makeException;
        self.argumentException = function(message, argument, data) {
            var msg = typeof argument === "undefined" ? message : message + " (argument: " + argument + ")";
            return makeException("ArgumentException", msg, data);
        };
        self.throwArgumentException = function(message, argument, data) {
            self.throw(self.argumentException(message, argument, data));
        };
        self.notImplementedException = function(message, data) {
            return makeException("NotImplementedException", message, data);
        };
        self.throwNotImplementedException = function(message, data) {
            self.throw(self.notImplementedException(message, data));
        };
        self.fetchException = function(request) {
            request = request || {};
            request.status = request.status || "unknown";
            return makeException("FetchException", "Server Request Failed with status: " + request.status, request);
        };
        self.throwFetchException = function(request) {
            self.throw(self.fetchException(request));
            throw new Error("Server Request Failed with status: " + request.status);
        };
        self.throwException = function(exception) {
            self.throw(exception);
        };
        self.throw = function(exception) {
            if (typeof exception === "string") {
                onError(makeException(exception));
            } else {
                onError(exception);
            }
        };
        return self;
    }
});

Hilary.scope("gidget").register({
    name: "GidgetApp",
    dependencies: [ "IGidgetModule", "GidgetPipelineEvent", "argumentValidator", "is" ],
    factory: function(IGidgetModule, GidgetPipelineEvent, argumentValidator, is) {
        "use strict";
        var GidgetApp = function(routeEngine) {
            var self = {
                start: undefined,
                pipelines: {},
                registerModule: undefined,
                registerModules: undefined
            };
            self.start = routeEngine.start;
            self.routeEngine = routeEngine;
            self.pipeline = routeEngine.pipeline;
            self.PipelineEvent = new GidgetPipelineEvent(self.pipeline);
            self.registerModule = function(gidgetModule) {
                if (!argumentValidator.validate(IGidgetModule, gidgetModule)) {
                    return;
                }
                var gets = gidgetModule.get, puts = gidgetModule.put, patches = gidgetModule.patch, posts = gidgetModule.post, dels = gidgetModule.del, get, put, patch, post, del;
                for (get in gets) {
                    if (gets.hasOwnProperty(get)) {
                        routeEngine.register.get(get, gets[get]);
                    }
                }
                for (put in puts) {
                    if (puts.hasOwnProperty(put)) {
                        routeEngine.register.put(put, puts[put]);
                    }
                }
                for (patch in patches) {
                    if (patches.hasOwnProperty(patch)) {
                        routeEngine.register.patch(patch, patches[patch]);
                    }
                }
                for (post in posts) {
                    if (posts.hasOwnProperty(post)) {
                        routeEngine.register.post(post, posts[post]);
                    }
                }
                for (del in dels) {
                    if (dels.hasOwnProperty(del)) {
                        routeEngine.register.del(del, dels[del]);
                    }
                }
            };
            self.registerModules = function(gidgetModules) {
                if (is.array(gidgetModules)) {
                    var i;
                    for (i = 0; i < gidgetModules.length; i += 1) {
                        self.registerModule(gidgetModules[i]);
                    }
                }
            };
            return self;
        };
        return GidgetApp;
    }
});

Hilary.scope("gidget").register({
    name: "GidgetModule",
    dependencies: [],
    factory: function() {
        "use strict";
        return function() {
            var self = {
                get: {},
                post: {},
                put: {},
                patch: {},
                del: {},
                register: {
                    get: undefined,
                    post: undefined,
                    put: undefined,
                    del: undefined
                }
            };
            self.register.get = function(routePath, routeHandler) {
                self.get[routePath] = routeHandler;
            };
            self.register.post = function(routePath, routeHandler) {
                self.post[routePath] = routeHandler;
            };
            self.register.put = function(routePath, routeHandler) {
                self.put[routePath] = routeHandler;
            };
            self.register.patch = function(routePath, routeHandler) {
                self.patch[routePath] = routeHandler;
            };
            self.register.del = function(routePath, routeHandler) {
                self.del[routePath] = routeHandler;
            };
            return self;
        };
    }
});

Hilary.scope("gidget").register({
    name: "GidgetPipeline",
    dependencies: [ "is", "locale", "exceptions" ],
    factory: function(is, locale, exceptions) {
        "use strict";
        var Pipeline = function() {
            var self, pipelineEvents, makePipelineTasks, validatePipelineEventCallback;
            self = {
                before: {
                    routeResolution: undefined,
                    routeExecution: undefined
                },
                after: {
                    routeResolution: undefined,
                    routeExecution: undefined
                },
                on: {
                    error: undefined,
                    scrollToHash: undefined
                },
                trigger: {
                    before: {
                        routeResolution: undefined,
                        routeExecution: undefined
                    },
                    after: {
                        routeResolution: undefined,
                        routeExecution: undefined
                    },
                    on: {
                        error: undefined
                    }
                }
            };
            pipelineEvents = {
                beforeRouteResolution: [],
                afterRouteResolution: [],
                before: [],
                after: [],
                error: [],
                scrollToHash: undefined
            };
            pipelineEvents.scrollToHash = function(err, req) {
                var el;
                if (req.uri.hash) {
                    el = document.getElementById(req.uri.hash);
                    if (el && el.scrollIntoView) {
                        el.scrollIntoView({
                            behavior: "smooth"
                        });
                    }
                }
            };
            validatePipelineEventCallback = function(callback) {
                if (is.not.function(callback)) {
                    self.trigger.on.error({
                        status: 500,
                        message: locale.errors.pipelineRequiresCallback
                    });
                    return false;
                }
                return true;
            };
            makePipelineTasks = function(pipeline, last) {
                var i, tasks = [], executeEvent, makeTask;
                executeEvent = function(i, err, request) {
                    var event = pipeline[i];
                    if (is.function(event) && event.length === 3) {
                        event(err, request, makeTask(i + 1));
                    } else if (is.function(event)) {
                        event(err, request);
                        makeTask(i + 1)(err, request);
                    }
                    if (event.once) {
                        pipeline.splice(i, 1);
                    } else if (is.function(event.remove) && event.remove(err, request)) {
                        pipeline.splice(i, 1);
                    }
                };
                makeTask = function(i) {
                    return function(err, request) {
                        if (pipeline.length === i) {
                            if (is.function(last)) {
                                last(err, request);
                            }
                        } else if (is.function(pipeline[i])) {
                            executeEvent(i, err, request);
                        } else {
                            makeTask(i + 1);
                        }
                    };
                };
                for (i = 0; i < pipeline.length; i += 1) {
                    tasks.push(makeTask(i));
                }
                return tasks;
            };
            self.trigger.before.routeExecution = function(err, request, next) {
                var tasks = makePipelineTasks(pipelineEvents.before, next);
                if (tasks.length) {
                    tasks[0](err, request, next);
                } else {
                    next(err, request);
                }
            };
            self.trigger.after.routeExecution = function(err, request) {
                var tasks;
                pipelineEvents.scrollToHash(err, request);
                tasks = makePipelineTasks(pipelineEvents.after);
                if (tasks.length) {
                    tasks[0](err, request);
                }
            };
            self.trigger.on.error = function(errorObject) {
                var err, i;
                if (is.object(errorObject) && errorObject.stack) {
                    err = errorObject;
                } else if (is.object(errorObject)) {
                    err = exceptions.makeException(errorObject.name, errorObject.message || locale.errors.defaultMessage, errorObject);
                } else if (is.string(errorObject)) {
                    err = exceptions.makeException(errorObject);
                } else {
                    err = errorObject;
                }
                for (i = 0; i < pipelineEvents.error.length; i += 1) {
                    pipelineEvents.error[i](err);
                }
            };
            self.trigger.before.routeResolution = function(request, next) {
                var tasks = makePipelineTasks(pipelineEvents.beforeRouteResolution, next);
                if (tasks.length) {
                    tasks[0](null, request, next);
                } else {
                    next(null, request);
                }
            };
            self.trigger.after.routeResolution = function(err, request, next) {
                var tasks = makePipelineTasks(pipelineEvents.afterRouteResolution, next);
                if (tasks.length) {
                    tasks[0](err, request, next);
                } else {
                    next(err, request);
                }
            };
            self.before.routeResolution = function(callback) {
                var cb;
                if (!validatePipelineEventCallback(callback)) {
                    return;
                }
                if (callback.length < 3) {
                    cb = function(err, req, next) {
                        callback(null, req);
                        next(null, req);
                    };
                    cb.once = callback.once;
                    cb.remove = callback.remove;
                    pipelineEvents.beforeRouteResolution.push(cb);
                } else {
                    pipelineEvents.beforeRouteResolution.push(callback);
                }
            };
            self.after.routeResolution = function(callback) {
                var cb;
                if (!validatePipelineEventCallback(callback)) {
                    return;
                }
                if (callback.length < 3) {
                    cb = function(err, route, next) {
                        callback(err, route);
                        next(null, route);
                    };
                    cb.once = callback.once;
                    cb.remove = callback.remove;
                    pipelineEvents.afterRouteResolution.push(cb);
                } else {
                    pipelineEvents.afterRouteResolution.push(callback);
                }
            };
            self.before.routeExecution = function(callback) {
                var cb;
                if (!validatePipelineEventCallback(callback)) {
                    return;
                }
                if (callback.length < 3) {
                    cb = function(err, request, next) {
                        callback(err, request);
                        next(null, request);
                    };
                    cb.once = callback.once;
                    cb.remove = callback.remove;
                    pipelineEvents.before.push(cb);
                } else {
                    pipelineEvents.before.push(callback);
                }
            };
            self.after.routeExecution = function(callback) {
                if (validatePipelineEventCallback(callback)) {
                    pipelineEvents.after.push(callback);
                }
            };
            self.on.error = function(callback) {
                if (validatePipelineEventCallback(callback)) {
                    pipelineEvents.error.push(callback);
                }
            };
            self.on.scrollToHash = function(callback) {
                if (validatePipelineEventCallback(callback)) {
                    pipelineEvents.scrollToHash = callback;
                }
            };
            return self;
        };
        return Pipeline;
    }
});

Hilary.scope("gidget").register({
    name: "GidgetPipelineEvent",
    dependencies: [ "is", "locale" ],
    factory: function(is, locale) {
        "use strict";
        var GidgetPipelineEvent, pipeline;
        GidgetPipelineEvent = function(event) {
            var self;
            event = event || {};
            if (is.not.function(event.eventHandler)) {
                self = function() {
                    pipeline.trigger.on.error({
                        status: 500,
                        message: locale.errors.pipelineEventRequiresHandler
                    });
                };
            } else {
                self = event.eventHandler;
            }
            if (is.boolean(event.once)) {
                self.once = event.once;
            }
            if (is.function(event.remove)) {
                self.remove = event.remove;
            }
            return self;
        };
        return function(routeEnginePipeline) {
            pipeline = routeEnginePipeline;
            return GidgetPipelineEvent;
        };
    }
});

Hilary.scope("gidget").register({
    name: "GidgetRequest",
    dependencies: [ "is" ],
    factory: function(is) {
        "use strict";
        return function(context) {
            var self = this, ctx;
            if (is.string(context)) {
                ctx = {};
            } else {
                ctx = context || {};
            }
            self.uri = context.uri;
            self.route = context.route;
            self.params = context.params;
            self.callback = context.callback;
            self.payload = context.payload;
        };
    }
});

Hilary.scope("gidget").register({
    name: "GidgetRoute",
    dependencies: [ "IGidgetRoute", "argumentValidator" ],
    factory: function(IGidgetRoute, argumentValidator) {
        "use strict";
        return function(route) {
            if (!argumentValidator.validate(IGidgetRoute, route)) {
                return;
            }
            var self = route.routeHandler;
            if (typeof route.before === "function") {
                self.before = route.before;
            }
            if (typeof route.after === "function") {
                self.after = route.after;
            }
            return self;
        };
    }
});

Hilary.scope("gidget").register({
    name: "BaseRouteEngine",
    dependencies: [ "Route", "GidgetRequest", "GidgetPipeline", "is", "uriHelper", "locale", "exceptions" ],
    factory: function(Route, GidgetRequest, GidgetPipeline, is, uriHelper, locale, exceptions) {
        "use strict";
        var RouteEngine = function(router) {
            var self, pipeline = new GidgetPipeline(), routes = [], regularExpressions, makeAsyncCallback, makeRouteExecutionQueue, addRoute, cleanseParamNames, parseRoute, parseParams, runAsync;
            router = router || {};
            self = {
                get: router.get,
                post: router.post,
                put: router.put,
                patch: router.patch,
                del: router.del,
                navigate: router.navigate,
                scrollToHash: router.scrollToHash,
                register: {
                    get: undefined,
                    post: undefined,
                    put: undefined,
                    patch: undefined,
                    del: undefined
                },
                parseRoute: undefined,
                resolveRoute: undefined,
                resolveAndExecuteRoute: undefined,
                start: router.start,
                pipeline: pipeline
            };
            regularExpressions = {
                escapeRegExp: /[-[\]{}()+?.,\\^$|#\s]/g,
                namedParam: /:(\w+)/g,
                splatParam: /\*(\w+)/g,
                firstParam: /(:\w+)|(\*\w+)/,
                allParams: /(:|\*)\w+/g,
                extractHash: /^[^#]*(#.*)$/
            };
            makeAsyncCallback = function(callback) {
                if (is.function(callback) && callback.length < 3) {
                    var asyncCallback = function(err, params, next) {
                        callback(err, params);
                        next(err, params);
                    };
                    asyncCallback.before = makeAsyncCallback(callback.before);
                    asyncCallback.after = makeAsyncCallback(callback.after);
                    return asyncCallback;
                } else {
                    return callback;
                }
            };
            makeRouteExecutionQueue = function(callback) {
                return function(err, request) {
                    var beforeThis, beforeAll, main, afterThis, afterAll;
                    beforeThis = function() {
                        if (is.function(callback.before)) {
                            callback.before(null, request, beforeAll);
                        } else {
                            beforeAll(null, request);
                        }
                    };
                    beforeAll = function(err, request) {
                        pipeline.trigger.before.routeExecution(err, request, main);
                    };
                    main = function(err, request) {
                        callback(err, request, afterThis);
                    };
                    afterThis = function(err, request) {
                        if (is.function(callback.after)) {
                            callback.after(err, request, afterAll);
                        } else {
                            afterAll(err, request);
                        }
                    };
                    afterAll = function(err, request) {
                        pipeline.trigger.after.routeExecution(err, request);
                    };
                    beforeThis();
                };
            };
            addRoute = function(verb, path, callback) {
                if (is.not.defined(path) || is.not.function(callback)) {
                    exceptions.throwArgumentException(locale.errors.requiresArguments.replace("{func}", "addRoute").replace("{args}", "(verb, path, callback)"));
                }
                routes.push({
                    route: parseRoute(verb, path),
                    callback: makeRouteExecutionQueue(makeAsyncCallback(callback))
                });
            };
            cleanseParamNames = function(names) {
                if (names !== null) {
                    var paramNames = [], i;
                    for (i = 0; i < names.length; i += 1) {
                        paramNames.push(names[i].substr(1));
                    }
                    return paramNames;
                } else {
                    return [];
                }
            };
            parseRoute = function(verb, path, caseSensitive) {
                var params, pattern;
                pattern = String(path);
                params = cleanseParamNames(pattern.match(regularExpressions.allParams));
                pattern = pattern.replace(regularExpressions.escapeRegExp, "\\$&");
                pattern = pattern.replace(regularExpressions.namedParam, "([^/]+)");
                pattern = pattern.replace(regularExpressions.splatParam, "(.+?)");
                return new Route({
                    expressionString: pattern,
                    paramNames: params,
                    verb: verb,
                    source: path
                }, caseSensitive);
            };
            parseParams = function(path, route) {
                var params = {}, matches, i;
                matches = path.match(route.expression);
                if (is.not.array(matches) || matches.length === 1) {
                    params.splat = [];
                    return params;
                }
                matches.shift();
                params.splat = matches;
                for (i = 0; i < route.paramNames.length; i += 1) {
                    params[route.paramNames[i]] = params.splat[i];
                }
                return params;
            };
            runAsync = function(handler) {
                if (is.not.function(handler)) {
                    exceptions.throwArgumentException(locale.errors.requiresArguments.replace("{func}", "runAsync").replace("{args}", "(handler)"));
                }
                setTimeout(handler, 0);
            };
            self.register.get = function(path, callback) {
                return addRoute("get", path, callback);
            };
            self.register.post = function(path, callback) {
                return addRoute("post", path, callback);
            };
            self.register.put = function(path, callback) {
                return addRoute("put", path, callback);
            };
            self.register.patch = function(path, callback) {
                return addRoute("patch", path, callback);
            };
            self.register.del = function(path, callback) {
                return addRoute("del", path, callback);
            };
            self.resolveRoute = function(path, verb, payload) {
                var uri = uriHelper.parseUri(path), makeRequest, i;
                makeRequest = function(uri, matchingRoute) {
                    return new GidgetRequest({
                        route: matchingRoute.route,
                        params: parseParams(uri.path, matchingRoute.route),
                        uri: uri,
                        callback: matchingRoute.callback,
                        payload: payload
                    });
                };
                for (i = 0; i < routes.length; i += 1) {
                    if (routes[i].route.expression.test(uri.path)) {
                        if (!verb) {
                            return makeRequest(uri, routes[i]);
                        } else if (routes[i].route.verb === verb) {
                            return makeRequest(uri, routes[i]);
                        }
                    }
                }
                return false;
            };
            self.resolveAndExecuteRoute = function(path, verb, callback, payload) {
                var uri = uriHelper.parseUri(path), beforeThis, main, afterThis, request;
                beforeThis = function() {
                    pipeline.trigger.before.routeResolution(new GidgetRequest({
                        uri: uri
                    }), main);
                };
                main = function(err, req) {
                    if (err) {
                        pipeline.trigger.on.error(err);
                        return;
                    }
                    request = self.resolveRoute(req.uri, verb, payload);
                    if (request === false) {
                        err = {
                            status: 404,
                            message: locale.errors.status404,
                            uri: uri
                        };
                        pipeline.trigger.on.error(err);
                    } else if (is.function(request.callback)) {
                        afterThis(request);
                    }
                };
                afterThis = function(request) {
                    pipeline.trigger.after.routeResolution(null, request, request.callback);
                    if (is.function(callback)) {
                        callback(null, request, payload);
                    }
                };
                beforeThis();
            };
            self.get = function(path, callback) {
                runAsync(function() {
                    self.resolveAndExecuteRoute(path, "get", callback);
                });
            };
            self.post = function(path, payload, callback) {
                runAsync(function() {
                    self.resolveAndExecuteRoute(path, "post", callback, payload);
                });
            };
            self.put = function(path, payload, callback) {
                runAsync(function() {
                    self.resolveAndExecuteRoute(path, "put", callback, payload);
                });
            };
            self.patch = function(path, payload, callback) {
                runAsync(function() {
                    self.resolveAndExecuteRoute(path, "patch", callback, payload);
                });
            };
            self.del = function(path, callback) {
                runAsync(function() {
                    self.resolveAndExecuteRoute(path, "del", callback);
                });
            };
            return self;
        };
        return RouteEngine;
    }
});

(function(Hilary, history) {
    "use strict";
    Hilary.scope("gidget").register({
        name: "DefaultRouteEngine",
        dependencies: [ "BaseRouteEngine", "is", "uriHelper" ],
        factory: function(RouteEngine, is, uriHelper) {
            var start, onLoad, addEventListeners, clickHandler, popstateHandler, routeEngine, originalTitle;
            (function() {
                start = function() {
                    addEventListeners();
                    onLoad();
                };
                onLoad = function() {
                    routeEngine.navigate(location.href);
                };
                clickHandler = function(event) {
                    var isValidHref;
                    isValidHref = is.string(event.target.localName) && event.target.localName === "a" && (event.target.target.length === 0 || event.target.target === "_self") && event.target.href.length > 0 && !(event.target.href.indexOf("javascript:") > -1 && event.target.href.indexOf("void(") > -1);
                    if (isValidHref) {
                        event.preventDefault();
                        routeEngine.navigate(event.target.href);
                    }
                };
                popstateHandler = function(event) {
                    if (is.string(event.state)) {
                        event.preventDefault();
                        routeEngine.navigate(event.state, null, false);
                    } else if (is.object(event.state) && is.object(event.state.uri) && is.defined(event.state.uri.path)) {
                        event.preventDefault();
                        routeEngine.navigate(null, event.state, false);
                    }
                };
                addEventListeners = function() {
                    document.addEventListener("click", clickHandler, false);
                    window.addEventListener("popstate", popstateHandler, false);
                };
            })();
            (function() {
                var makeOptions, makeState;
                makeOptions = function(pathOrOptions, data, pushStateToHistory) {
                    var options = {};
                    if (is.string(pathOrOptions)) {
                        options.path = pathOrOptions;
                        options.data = data;
                        options.pushStateToHistory = pushStateToHistory;
                    } else {
                        options = pathOrOptions;
                        options.data = options.data || data;
                        options.pushStateToHistory = is.defined(options.pushStateToHistory) ? options.pushStateToHistory : pushStateToHistory;
                    }
                    options.pushStateToHistory = options.pushStateToHistory || is.not.defined(options.pushStateToHistory);
                    return options;
                };
                makeState = function(path, data) {
                    var state = data || {}, pathIsLocal;
                    state.uri = state.uri || uriHelper.parseUri(path);
                    originalTitle = originalTitle || document.title;
                    state.title = state.title || originalTitle;
                    pathIsLocal = !state.uri.host || state.uri.host === document.location.host;
                    if (!pathIsLocal) {
                        state.redirect = true;
                    }
                    return state;
                };
                routeEngine = new RouteEngine({
                    start: start
                });
                routeEngine.navigate = function(pathOrOptions, data, pushStateToHistory) {
                    var options = makeOptions(pathOrOptions, data, pushStateToHistory), state = makeState(options.path, options.data);
                    if (state.redirect) {
                        window.location = options.path;
                        return;
                    }
                    routeEngine.get(state.uri, function(err, req) {
                        var title = req.title || state.title || "home";
                        state.title = title;
                        if (options.pushStateToHistory) {
                            history.pushState(state, title, state.uri.relativePath);
                            document.title = title;
                        } else {
                            document.title = title;
                        }
                        if (is.function(options.callback)) {
                            options.callback(req);
                        }
                    });
                };
                routeEngine.redirect = routeEngine.navigate;
                routeEngine.updateHistory = function(path, data) {
                    var state = makeState(path, data), title = state.title || "home";
                    state.title = title;
                    history.replaceState(state, title, state.uri.relativePath);
                    document.title = title;
                };
                routeEngine.dispose = function() {
                    document.removeEventListener("click", clickHandler, false);
                    window.removeEventListener("popstate", popstateHandler, false);
                };
            })();
            return routeEngine;
        }
    });
})(Hilary, window.history);

Hilary.scope("gidget").register({
    name: "DefaultGidgetBootstrapper",
    dependencies: [ "is" ],
    factory: function(is) {
        "use strict";
        var Bootstrapper = function(scope, bootstrapper) {
            var start, composeLifecycle, composeModules, composeRoutes, onComposed, onError;
            scope = scope || new Hilary();
            bootstrapper = bootstrapper || {};
            bootstrapper.options = bootstrapper.options || {};
            bootstrapper.hilary = bootstrapper.hilary || {};
            onError = function(err) {
                console.log(err);
            };
            start = function() {
                if (is.function(bootstrapper.start)) {
                    bootstrapper.start(null, composeLifecycle);
                } else {
                    composeLifecycle(null, new Gidget(bootstrapper.options));
                }
            };
            composeLifecycle = function(err, gidgetApp) {
                if (err) {
                    onError(err);
                }
                if (is.function(bootstrapper.composeLifecycle) && bootstrapper.composeLifecycle.length === 4) {
                    bootstrapper.composeLifecycle(err, gidgetApp, gidgetApp.pipeline, composeModules);
                } else if (is.function(bootstrapper.composeLifecycle)) {
                    bootstrapper.composeLifecycle(err, gidgetApp, gidgetApp.pipeline);
                    composeModules(err, gidgetApp);
                } else {
                    composeModules(err, gidgetApp);
                }
            };
            composeModules = function(err, gidgetApp) {
                if (err) {
                    onError(err);
                }
                scope.register({
                    name: "gidgetApp",
                    factory: function() {
                        return gidgetApp;
                    }
                });
                scope.register({
                    name: "gidgetRouter",
                    factory: function() {
                        return gidgetApp.routeEngine;
                    }
                });
                scope.register({
                    name: "application",
                    factory: function() {
                        return {
                            restart: function() {
                                start();
                            }
                        };
                    }
                });
                if (is.function(bootstrapper.composeModules) && bootstrapper.composeModules.length === 3) {
                    bootstrapper.composeModules(err, gidgetApp, composeRoutes);
                } else if (is.function(bootstrapper.composeModules)) {
                    bootstrapper.composeModules(err, gidgetApp);
                    composeRoutes(err, gidgetApp);
                } else {
                    composeRoutes(err, gidgetApp);
                }
            };
            composeRoutes = function(err, gidgetApp) {
                if (err) {
                    onError(err);
                }
                if (is.function(bootstrapper.composeRoutes) && bootstrapper.composeRoutes.length === 3) {
                    bootstrapper.composeRoutes(err, gidgetApp, onComposed);
                } else if (is.function(bootstrapper.composeRoutes)) {
                    bootstrapper.composeRoutes(err, gidgetApp);
                    onComposed(err, gidgetApp);
                } else {
                    onComposed(err, gidgetApp);
                }
            };
            onComposed = function(err, gidgetApp) {
                var startRouteEngine;
                if (err) {
                    onError(scope, err);
                }
                startRouteEngine = function() {
                    gidgetApp.routeEngine.start();
                };
                if (is.function(bootstrapper.onComposed) && bootstrapper.onComposed.length === 3) {
                    bootstrapper.onComposed(err, gidgetApp, startRouteEngine);
                } else if (is.function(bootstrapper.onComposed)) {
                    bootstrapper.onComposed(err, gidgetApp);
                    startRouteEngine();
                } else {
                    startRouteEngine();
                }
            };
            if (bootstrapper.options.composeHilary !== false) {
                scope.Bootstrapper({
                    composeLifecycle: bootstrapper.hilary.composeLifecycle,
                    composeModules: bootstrapper.hilary.composeModules,
                    onComposed: function(err, scope) {
                        if (is.function(bootstrapper.hilary.onComposed)) {
                            bootstrapper.hilary.onComposed(err, scope);
                        }
                        start();
                    }
                });
            } else {
                start();
            }
        };
        return Bootstrapper;
    }
});

Hilary.scope("gidget").register({
    name: "Route",
    factory: function() {
        "use strict";
        return function(route, caseSensitive) {
            var self = this, flags = caseSensitive ? "" : "i";
            route = route || {};
            self.expression = new RegExp("^" + route.expressionString + "/?$", flags);
            self.expressionString = route.expressionString;
            self.paramNames = route.paramNames;
            self.source = String(route.source);
            self.verb = route.verb;
        };
    }
});

Hilary.scope("gidget").register({
    name: "uriHelper",
    singleton: true,
    dependencies: [ "is", "locale", "exceptions" ],
    factory: function(is, locale, exceptions) {
        "use strict";
        var self = {
            parseUri: undefined
        }, expressions = /^(?:(?![^:@]+:[^:@\/]*@)(http|https|ws|wss):\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?((?:[a-f0-9]{0,4}:){2,7}[a-f0-9]{0,4}|[^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/, parts = [ "source", "protocol", "authority", "userAndPassword", "user", "password", "hostName", "port", "relativePath", "path", "directory", "file", "queryString", "hash" ], queryPart = {
            name: "query",
            parser: /(?:^|&)([^&=]*)=?([^&]*)/g
        };
        self.parseUri = function(uriString) {
            if (is.not.defined(uriString)) {
                exceptions.throwArgumentException(locale.errors.parseUriRequiresUriString, "uriString");
            } else if (is.not.string(uriString) && uriString.path) {
                return uriString;
            } else if (is.not.string(uriString)) {
                exceptions.throwArgumentException(locale.errors.parseUriRequiresUriString, "uriString");
            }
            var src = uriString, bracketStartIdx = uriString.indexOf("["), bracketEndIdx = uriString.indexOf("]"), matches, uri = {}, i = 14;
            if (bracketStartIdx !== -1 && bracketEndIdx !== -1) {
                uriString = uriString.substring(0, bracketStartIdx) + uriString.substring(bracketStartIdx, bracketEndIdx).replace(/:/g, ";") + uriString.substring(bracketEndIdx, uriString.length);
            }
            matches = expressions.exec(uriString || "");
            while (i--) {
                uri[parts[i]] = matches[i] || undefined;
            }
            if (bracketStartIdx !== -1 && bracketEndIdx !== -1) {
                uri.source = src;
                uri.host = uri.host.substring(1, uri.host.length - 1).replace(/;/g, ":");
                uri.authority = uri.authority.replace("[", "").replace("]", "").replace(/;/g, ":");
                uri.ipv6uri = true;
            }
            uri.port = uri.port && parseInt(uri.port);
            if (is.string(uri.queryString)) {
                uri[queryPart.name] = {};
                uri.queryString.replace(queryPart.parser, function($0, $1, $2) {
                    if ($1) {
                        uri[queryPart.name][$1] = $2;
                    }
                });
            }
            uri.host = uri.hostName && uri.port ? uri.hostName.concat(":", uri.port) : uri.hostName;
            uri.origin = uri.authority && uri.protocol.concat("://", uri.authority.replace(uri.userAndPassword, "").replace("@", ""));
            return uri;
        };
        return self;
    }
});

(function(Hilary, scope, exports) {
    "use strict";
    scope.Bootstrapper({
        composeLifecycle: function(err, scope, pipeline) {
            pipeline.on.error(function(err) {
                try {
                    scope.resolve("exceptions").throw(err);
                } catch (e) {
                    console.log(e);
                    console.log(err);
                }
            });
        },
        composeModules: function(err, scope) {
            var exceptions;
            scope.register({
                name: "Blueprint",
                singleton: true,
                factory: function() {
                    return Hilary.Blueprint;
                }
            });
            scope.register({
                name: "is",
                singleton: true,
                factory: function() {
                    return scope.getContext().is;
                }
            });
            scope.register({
                name: "exceptions",
                singleton: true,
                dependencies: [ "ExceptionHandler" ],
                factory: function(ExceptionHandler) {
                    if (!exceptions) {
                        exceptions = new ExceptionHandler(function(exception) {
                            if (exception.data) {
                                console.log(exception.message, exception.data);
                            } else {
                                console.log(exception.message);
                            }
                            throw exception;
                        });
                    }
                    return exceptions;
                }
            });
            scope.register({
                name: "Gidget",
                blueprint: "IGidget",
                dependencies: [ "IRouteEngine", "GidgetModule", "GidgetRoute", "DefaultGidgetBootstrapper", "GidgetApp", "argumentValidator" ],
                factory: function(IRouteEngine, GidgetModule, GidgetRoute, DefaultGidgetBootstrapper, GidgetApp, argumentValidator) {
                    var Gidget = function(options) {
                        options = options || {};
                        options.routeEngine = options.routeEngine || scope.resolve("DefaultRouteEngine");
                        if (!argumentValidator.validate(IRouteEngine, options.routeEngine)) {
                            return;
                        }
                        return new GidgetApp(options.routeEngine);
                    };
                    Gidget.GidgetModule = GidgetModule;
                    Gidget.GidgetRoute = GidgetRoute;
                    Gidget.Bootstrapper = DefaultGidgetBootstrapper;
                    return Gidget;
                }
            });
        },
        onComposed: function(err, scope) {
            var Gidget = scope.resolve("Gidget");
            exports.Gidget = Gidget;
        }
    });
})(Hilary, Hilary.scope("gidget"), typeof module !== "undefined" && module.exports ? module.exports : window);