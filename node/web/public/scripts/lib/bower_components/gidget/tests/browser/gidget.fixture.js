Hilary.scope('gidget-tests').register({
    name: 'gidget.fixture',
    dependencies: ['describe', 'it', 'expect'],
    factory: function (describe, it, expect) {
        'use strict';

        describe('Gidget', function () {

            it('should exist on window', function () {
                expect(window.Gidget).to.not.equal(undefined);
            });

        });
    }
});
