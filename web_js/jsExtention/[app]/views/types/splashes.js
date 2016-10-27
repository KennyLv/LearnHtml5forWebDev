define(['aq/eventEmitter'], function (EventEmitter) {
    'use strict';

    return EventEmitter.extend({

        events: {
            goNext: 'goNext',
            goBack: 'goBack'
        },

        init: function (display) {
            this.display = display;
            this.template = this.generateTemplate();
        },

        render: function () {
            this.display.updateScreen(this.template);
        },

        generateTemplate: function () {
            var items = [{
                text: 'vp2c-8 sample 1',
                value: {
                    template: 'samples/splash',
                    data: {
                        buttons: [1]
                    }
                }
            }];

            return {
                templateId: 'vp2c-3',
                backgroundImage: 'file:///templates/images/black-bg.png',
                templateContent: {
                    title: $.t('VP2C-8 samples'),
                    list: _.map(items, function (item) {
                        return _.extend(item, {
                            action: this.events.goNext
                        });
                    }, this),
                    buttons: {
                        1: {
                            text: $.t('back'),
                            action: this.events.goBack
                        }
                    }
                }
            };
        }
    });
});