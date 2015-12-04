Hilary.scope('heinz').register({
    name: 'locale::en_US',
    factory: {
        'pages': {
            'home': {
                'empty': {
                    'heading': 'Welcome to Papyr!',
                    'body': 'To get started, you can search for books. Try "adams", "wild", "robbins", "swamp", "india", "tropper", "di", "world", or "novel". If nothing returns, make sure you ran `grunt seed`.'
                }
            },
            'errors': {
                'e403': {
                    'heading': '403',
                    'body': 'Access denied'
                },
                'e404': {
                    'heading': '404',
                    'body': '{{path}} was not found'
                },
                'e500': {
                    'heading': 'Whoops!',
                    'body': 'Something went terribly wrong.'
                }
            }
        },
        'js': {
            'ViewEngine': {
                'setVM.viewModelRequired': 'When setting the mainVM, the viewModel argument must be an object.'
            }
        },
        'server': {

        }
    }
});
