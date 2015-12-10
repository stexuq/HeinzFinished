(function (testScope, scope) {
    'use strict';

    testScope.register({
        name: 'blueprint.fixture',
        dependencies: ['gidgetScope', 'describe', 'it', 'expect'],
        factory: function (gidgetScope, describe, it, expect) {

            describe('Blueprints in gidget', function () {

                describe('when a module declares a blueprint', function () {

                    it('should implement the Blueprint that it declares', function () {
                        // when
                        var actual = scope.validateBlueprints();

                        if (actual.result === false) {
                            console.log('blueprint errors:', actual.errors);
                        }

                        // then
                        expect(actual.result).to.equal(true);
                    });

                }); // /declared blueprints

                describe('Gidget, on the window', function () {

                    it('should implement IGidget', function (done) {
                        // given
                        var IGidget = gidgetScope.resolve('IGidget');

                        // when
                        IGidget.signatureMatches(Gidget, function (err, actual) {
                            // then
                            expect(err).to.equal(null);
                            expect(actual).to.equal(true);
                            done();
                        });
                    });

                }); // /on window

                describe('when a new Gidget instance is created', function () {

                    it('should return an object that implements IGidgetApp', function (done) {
                        // given
                        var gidget = new Gidget(),
                            IGidgetApp = gidgetScope.resolve('IGidgetApp');

                        // when
                        IGidgetApp.signatureMatches(gidget, function (err, actual) {
                            // then
                            expect(err).to.equal(null);
                            expect(actual).to.equal(true);
                            done();
                        });
                    });

                    it('should have a routeEngine that implements IRouteEngine on it', function (done) {
                        // given
                        var gidget = new Gidget(),
                            IRouteEngine = gidgetScope.resolve('IRouteEngine');

                        // when
                        IRouteEngine.signatureMatches(gidget.routeEngine, function (err, actual) {
                            // then
                            expect(err).to.equal(null);
                            expect(actual).to.equal(true);
                            done();
                        });
                    });

                }); // /new Gidget instances

            }); // /Blueprints in gidget

        }
    });

}(Hilary.scope('gidget-tests'), Hilary.scope('GidgetContainer')));
