define(['aq/eventEmitter'], function (EventEmitter) {
    'use strict';

    return EventEmitter.extend({

        events: {
            goNext: 'goNext',
            goBack: 'goBack',
            showAction: 'showAction',
            close: 'close'
        },

        init: function (display, options) {
            this.display = display;
            if (options && options.data) {
                this.template = this.generateTemplate(options.data);
            }
        },

        render: function (options, text) {
            if (options) {
                this.template = this.generateTemplate(options.data);
            }
            this.template.templateContent.main.text = text || this.template.templateContent.main.text;
            this.display.updateScreen(this.template);
        },

        generateTemplate: function (data) {
            var tpl = {
                templateId: 'vp2c-1',
                backgroundImage: 'file:///templates/images/black-bg.png',
                templateContent: {
                    main: {}
                }
            };

            // generate buttons
            var buttons = {};
            data.buttons.forEach(function (key) {
                buttons[key] = {
                    "text": 'Button ' + key,
                    "action": data.event || this.events.goBack,
                    "value": 'Pressed button ' + key
                };
            }, this);

            if (data.main) {
                tpl.templateContent.main.text = data.main;
            }

            if (data.title) {
                tpl.templateContent.title = data.title;
            }

            tpl.templateContent.buttons = buttons;

            return tpl;
        }
    });
});