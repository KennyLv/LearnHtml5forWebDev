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
                text: 'Lists',
                value: {
                    template: 'samples/partial/list'
                }
            }, {
                text: 'Players',
                value: {
                    template: 'samples/partial/player'
                }
            }];

            return {
                templateId: 'vp2c-3',
                backgroundImage: 'file:///templates/images/black-bg.png',
                templateContent: {
                    title: $.t('Partial update samples'),
                    list: _.map(items, function (item) {
                        return _.extend(item, {
                            action: this.events.goNext
                        });
                    }, this),
                    buttons: {
                        1: {
                            image: 'file:///templates/images/list-button.png',
                            action: this.events.goBack
                        }
                    }
                }
            };
        }

    });
});