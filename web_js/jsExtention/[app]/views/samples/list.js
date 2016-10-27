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
        },

        render: function (options) {
            this.template = this.generateTemplate(options.data);
            this.display.updateScreen(this.template);
        },

        generateTemplate: function (data) {

            var options = data.options || {};

            // generate buttons
            var buttons = {};
            data.buttons.forEach(function (key) {
                buttons[key] = {
                    "text": 'Button ' + key,
                    "action": key === 1 ? this.events.goBack : this.events.showAction,
                    "value": 'Pressed button ' + key
                };
            }, this);

            // generate list items
            var items = _.range(0, data.items || _.random(3, 50)).map(function (key) {
                return {
                    text: 'Item ' + key,
                    action: this.events.showAction,
                    value: 'Pressed item ' + key,
                    image1: options.leftImage || '',
                    image2: options.rightImage || ''
                };
            }, this);

            return {
                templateId: 'vp2c-3',
                backgroundImage: 'file:///templates/images/black-bg.png',
                templateContent: {
                    title: $.t('List'),
                    list: items,
                    buttons: $.extend(true, {
                        1: {
                            image: 'file:///templates/images/sidebtn_icon-back.png',
                            action: this.events.goBack
                        }
                    }, buttons)
                }
            };
        }

    });
});