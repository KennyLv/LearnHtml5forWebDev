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

            // generate buttons
            var buttons = {};
            var options = data.options || {};

            data.buttons.forEach(function (key) {
                buttons[key] = {
                    text: 'Button ' + key,
                    action: this.events.goBack,
                    value: 'Pressed button ' + key
                };

                if (options.useImage) {
                    if (!data.text) delete buttons[key].text;
                    buttons[key].image = 'file:///templates/images/now_playing.png';
                }

                if (options.useLongText) {
                    buttons[key].text = _.range(0, 200).join('W');
                }

                if (options.useLineBreak) {
                    buttons[key].text = _.range(0, options.howMany).map(function () {
                        return _.range(0, 10).join('W');
                    }).join('\n');
                }
            }, this);

            return {
                templateId: 'vp2c-5',
                backgroundImage: 'file:///templates/images/black-bg.png',
                templateContent: {
                    title: {
                        image: 'file:///templates/images/home-logo-iHeartRadio.png'
                    },
                    buttons: buttons
                }
            };
        }

    });
});