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

            var images = [
                '',
                'file:///templates/images/close-icon.png',
                'file:///templates/images/next-icon.png'
            ];

            // generate buttons
            var buttons = {};
            data.buttons.forEach(function (key) {
                buttons[key] = {
                    "text": 'Button ' + key,
                    "action": this.events.goBack,
                    "value": 'Pressed button ' + key
                };
                if (images[key]) {
                    buttons[key].image = images[key];
                }
            }, this);

            var text;
            if (!data.skipText) {
                text = _.range(1, _.random(2, 4)).reduce(function (memo, key) {
                    memo[key] = new Array(_.random(1, 50)).join('w');
                    return memo;
                }, {});
            }

            var mainImage;
            if (!data.skipImage) {
                mainImage = {
                    1: 'file:///templates/images/preview-' + _.random(1,4) + '.png'
                };
            }

            return {
                templateId: 'vp2c-7',
                backgroundImage: 'file:///templates/images/black-bg.png',
                templateContent: {
                    buttons: buttons,
                    main: {
                        text: text,
                        images: mainImage
                    }
                }
            };
        }

    });
});