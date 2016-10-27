define(['aq/eventEmitter'], function (EventEmitter) {
    'use strict';

    return EventEmitter.extend({

        events: {
            goNext: 'goNext',
            goBack: 'goBack',
            showAction: 'showAction'
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
                text: '1 button',
                value: {
                    template: 'samples/preview',
                    data: {
                        buttons: [1]
                    }
                }
            }, {
                text: '2 buttons',
                value: {
                    template: 'samples/preview',
                    data: {
                        buttons: [1,2]
                    }
                }
            }, {
                text: '3 buttons',
                value: {
                    template: 'samples/preview',
                    data: {
                        buttons: [1,3,4]
                    }
                }
            }, {
                text: 'text labels missed',
                value: {
                    template: 'samples/preview',
                    data: {
                        skipText: true,
                        buttons: [1,3]
                    }
                }
            }, {
                text: 'main image missed',
                value: {
                    template: 'samples/preview',
                    data: {
                        skipImage: true,
                        buttons: [1,4]
                    }
                }
            }];

            return {
                templateId: 'vp2c-3',
                backgroundImage: 'file:///templates/images/black-bg.png',
                templateContent: {
                    title: $.t('Popups'),
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