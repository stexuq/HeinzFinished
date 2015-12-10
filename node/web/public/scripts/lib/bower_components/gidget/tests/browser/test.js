/*globals describe, it, xdescribe, xit, chai*/
(function (exports, scope, gidgetScope, describe, it, xdescribe, xit, expect) {
    'use strict';

    var compose, start;

    compose = function (onReady) {
        scope.setParentContainer(gidgetScope);

        scope.register({ name: 'describe', factory: function () { return describe; } });
        scope.register({ name: 'it', factory: function () { return it; } });
        scope.register({ name: 'xdescribe', factory: function () { return xdescribe; } });
        scope.register({ name: 'xit', factory: function () { return xit; } });
        scope.register({ name: 'expect', factory: function () { return expect; } });
        scope.register({ name: 'is', factory: function () { return scope.getContext().is; } });
        scope.register({ name: 'gidgetScope', factory: function () { return gidgetScope; } });
        // scope.register({ name: 'Blueprint', factory: function () { return Hilary.Blueprint; } });

        if (onReady) {
            onReady();
        }
    };

    start = function () {
        scope.resolve('gidget.fixture');
        scope.resolve('blueprint.fixture');
        scope.resolve('DefaultRouteEngine.fixture');
        scope.resolve('BaseRouteEngine.fixture');
        scope.resolve('pipeline.fixture');
        scope.resolve('uriHelper.fixture');
        scope.resolve('GidgetModule.fixture');
    };

    compose(start);

}(window, Hilary.scope('gidget-tests'), Hilary.scope('gidget'), describe, it, xdescribe, xit, chai.expect));
