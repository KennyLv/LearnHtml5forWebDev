define(function () {
    'use strict';

    var Dic = require('aq/di'),
        AppServices = require('aq/dic'),
        display = [AppServices.get('display')];

    return new Dic({

        controller: {
            module: require('templates/controllers/controller'),
            dependencies: [],
            register: true // true by default, optional param
        },

        navigationList: {
            module: require('templates/views/navigationList'),
            dependencies: display
        },

        popup: {
            module: require('templates/views/samples/popup'),
            dependencies: display
        },

        'types/popups': {
            module: require('templates/views/types/popups'),
            dependencies: display
        },

        'samples/popup': {
            module: require('templates/views/samples/popup'),
            dependencies: display
        },

        'types/lists': {
            module: require('templates/views/types/lists'),
            dependencies: display
        },

        'samples/list': {
            module: require('templates/views/samples/list'),
            dependencies: display
        },

        'types/controls': {
            module: require('templates/views/types/controls'),
            dependencies: display
        },

        'samples/controls': {
            module: require('templates/views/samples/controls'),
            dependencies: display
        },

        'types/players': {
            module: require('templates/views/types/players'),
            dependencies: display
        },

        'samples/player': {
            module: require('templates/views/samples/player'),
            dependencies: display
        },

        'types/litePlayers': {
            module: require('templates/views/types/litePlayers'),
            dependencies: display
        },

        'samples/litePlayer': {
            module: require('templates/views/samples/litePlayer'),
            dependencies: display
        },

        'types/previews': {
            module: require('templates/views/types/previews'),
            dependencies: display
        },

        'samples/preview': {
            module: require('templates/views/samples/preview'),
            dependencies: display
        },

        'types/partial': {
            module: require('templates/views/types/partial'),
            dependencies: display
        },

        'samples/partial/list': {
            module: require('templates/views/samples/partial/list'),
            dependencies: display
        },

        'samples/partial/player': {
            module: require('templates/views/samples/partial/player'),
            dependencies: display
        },

        'types/splashes': {
            module: require('templates/views/types/splashes'),
            dependencies: display
        },

        'samples/splash': {
            module: require('templates/views/samples/splash'),
            dependencies: display
        },

        'types/huAPI': {
            module: require('templates/views/types/huAPI'),
            dependencies: [display[0],
                AppServices.get('audio'),
                AppServices.get('storage'),
                AppServices.get('navigation'),
                AppServices.get('profile')
            ]
        },

        'types/appSwitch': {
            module: require('templates/views/types/appSwitch'),
            dependencies: [display[0], AppServices.get('appContainer')]
        }
    });
});
