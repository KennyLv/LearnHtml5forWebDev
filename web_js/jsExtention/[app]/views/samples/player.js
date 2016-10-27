define(['aq/eventEmitter', 'templates/views/generator'], function (EventEmitter, generator) {
    'use strict';

    return EventEmitter.extend({

        events: {
            goNext: 'goNext',
            goBack: 'goBack',
            showAction: 'showAction'
        },

        images: {
            1: 'file:///templates/images/main.png',
            back: 'file:///templates/images/sidebtn_icon-back.png',
            button: 'file:///templates/images/stripe/<%= key %>.png',
            stripeBtnL: 'file:///templates/images/pressed/player/l_pressed.png',
            stripeBtnR: 'file:///templates/images/pressed/player/r_pressed.png',
            stripeBtnC: 'file:///templates/images/pressed/player/c_pressed.png'
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

            var buttons = this.getButtons(data.buttons, options);

            // text items
            var items = {};
            if (data.textItems) {
                items = generator.generateItems.call(this, data.textItems, _.extend({
                    isTextItem: true,
                    image: 'file:///templates/images/stripe/text-item.png'
                }, options));
            }

            // progress bar
            var progress;
            if (data.progress) {
                progress = this.getProgress(data.progress.playing);
            }

            return {
                templateId: 'vp2c-6',
                backgroundImage: 'file:///templates/images/background-Pandora.png',
                templateContent: {
                    title: {
                        image: 'file:///templates/images/branding-pandora-header.png'
                    },
                    buttons: $.extend(true, {}, buttons, {
                        7: {
                            image: this.getImage('back'),
                            action: this.events.goBack
                        }
                    }),
                    main: {
                        text: items,
                        images: {
                            1: data.image || ''
                        }
                    },
                    progress: progress
                }
            };
        },

        getProgress: function (active) {
            var duration = _.random(1, 240),
                elapsed = _.random(0, duration);
            return {
                total: duration,
                elapsed: elapsed,
                color: '#3E3EF0',
                active: active
            };
        },
        
        getButtons: function (buttons, options) {
            options = options || {};
            buttons = _.isArray(buttons) ? buttons : [];

            return generator.generateItems.call(this, buttons, _.extend({
                image: this.getButtonImages(buttons),
                images: this.images,
                action: (options.usePressedState || options.useHover) ? 'none' : this.events.showAction,
                hoverIsActive: options.useHover
            }, options));
        },

        getButtonImages: function (buttons) {
            return buttons.map(function (key) {
                return _.template(this.getImage('button'), {key: key});
            }, this);
        },

        getImage: function (name) {
            return this.images[name];
        }
    });
});