define(['aq/eventEmitter', 'templates/views/compositions'], function (EventEmitter, compositions) {
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
                text: '6 buttons',
                value: {
                    template: 'samples/controls',
                    data: {
                        buttons: [1,2,3,4,5,6]
                    }
                }
            }, {
                text: '5 buttons',
                value: {
                    template: 'samples/controls',
                    data: {
                        buttons: [2,3,5,6,7]
                    }
                }
            }, {
                text: '3 buttons',
                value: {
                    template: 'samples/controls',
                    data: {
                        buttons: [7,8,9]
                    }
                }
            }];

            items = items.concat(compositions.getItemComposition().map(function (item) {
                return {
                    text: item.text,
                    value: {
                        template: 'samples/controls',
                        data: {
                            buttons: [1,2,3,4,5,6],
                            options: item.options
                        }
                    }
                };
            }));

            return {
                templateId: 'vp2c-3',
                backgroundImage: 'file:///templates/images/black-bg.png',
                templateContent: {
                    title: $.t('Lists'),
                    list: _.map(items, function (item) {
                        return _.extend(item, {
                            action: this.events.goNext
                        });
                    }, this),
                    buttons: {
                        1: {
                            image: 'file:///templates/images/sidebtn_icon-back.png',
                            text: $.t('back'),
                            action: this.events.goBack
                        }
                    }
                }
            };
        }

    });
});