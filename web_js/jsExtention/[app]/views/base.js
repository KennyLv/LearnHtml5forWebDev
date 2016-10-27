define(['aq/eventEmitter'], function (EventEmitter) {
    'use strict';

    return EventEmitter.extend({

        events: {
            goNext: 'goNext',
            goBack: 'goBack',
            showAction: 'showAction'
        },

        images: {
            back: 'file:///templates/images/sidebtn_icon-back.png'
        },

        init: function (display) {
            this.template = {};
            this.display = display;
        },

        render: function (options) {
            this.template = this.generateTemplate(options.data);
            this.display.updateScreen(this.template);
        },

        generateTemplate: function () {
            throw new Error('Abstract method');
        }

    });
});