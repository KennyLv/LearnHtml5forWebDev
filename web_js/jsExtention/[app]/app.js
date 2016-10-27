define(['templates_di', 'aq/dic', 'aq/mixins/events'], function (dic, aq, events) {
    'use strict';

    var Logger = aq.get('Logger'),
        logger = new Logger('med', 'WEB_VIEW', '[Templates]');

    logger.log('app.js loaded');

    // public app interface
    var app = _.extend({

        init: function () {
            this.controller = dic.create('controller', dic);
            this.controller.on('suspend', this.suspend, this);

            logger.log('app init');
            return this;
        },

        start: function () {
            logger.log('app start');
            dic.start();
        },

        suspend: function () {
            this.trigger('suspend');
        },

        onSuspend: function () {
            dic.suspend();
        },

        onClose: function () {
            dic.close();
        }
    }, events);

    return app.init();
});