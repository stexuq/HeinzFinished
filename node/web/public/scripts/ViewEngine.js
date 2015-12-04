Hilary.scope('heinz').register({
    name: 'ViewEngine',
    singleton: true,
    dependencies: ['jQuery', 'ko', 'is', 'locale', 'exceptions'],
    factory: function ($, ko, is, locale, exceptions) {
        'use strict';

        var ViewEngine;

        // this is what is returned by this function
        ViewEngine = function ($element) {
            var self = this,
                mainVM,
                setVM;

            mainVM = {
                viewModel: ko.observable(),
                afterRender: undefined
            };

            setVM = function (viewModel) {
                if (is.not.object(viewModel)) {
                    exceptions.throwException(exceptions.argumentException(locale.js.ViewEngine['setVM.viewModelRequired'], 'viewModel'));
                    return;
                }

                var afterRender = function () {
                    if (is.function(viewModel.after)) {
                        viewModel.after(mainVM);
                    }

                    $element.removeClass('out').addClass('in');
                };

                // reset the scroll position to top
                if (window.scroll) {
                    window.scroll(0, 0);
                }

                // assuming a CSS transition on "in" and "out" exists, this would kick it off
                $element.removeClass('in').addClass('out');

                mainVM.afterRender = afterRender;
                mainVM.viewModel(viewModel);
            };

            /*
            // mainVM is a singleton - there will only ever be one
            // it is the master view model that is used for refreshing page content
            */
            self.mainVM = mainVM;

            /*
            // setVM is used to update the viewModel property of the mainVM
            // @param viewModel (object): The active viewModel
            */
            self.setVM = setVM;
        };

        return ViewEngine;
    }
});
