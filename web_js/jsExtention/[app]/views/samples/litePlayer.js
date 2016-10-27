define(['templates/views/samples/player', 'templates/views/generator'], function (Player, generator) {
    'use strict';

    return Player.extend({

        events: {
            goNext: 'goNext',
            goBack: 'goBack',
            showAction: 'showAction'
        },

        init: function (display) {

            this.images = _.extend({
                2: 'file:///templates/images/list_icon-pandora_shuffle.png',
                huge: 'file:///templates/images/huge/<%= key %>.png'
            }, this.images);

            this.display = display;
        },

        render: function (options) {
            this.template = this.generateTemplate(options.data);
            this.display.updateScreen(this.template);
            // apply defaults
            this.useSameImages = this.useUniqueHugeImages = false;
        },

        generateTemplate: function (data) {

            this.useSameImages = data.options && data.options.useSameImages;
            this.useUniqueHugeImages = data.options && data.options.useUniqueHugeImages;

            var buttons = {};
            if (data.buttons || data.full) {
                buttons = this.getButtons(_.range(1, 7), {
                    useImage: true,
                    usePressedState: data.options && data.options.usePressedState,
                    useHover: data.useHover
                });
            }

            var images = {};
            if (data.images || data.full) {
                [1, 2].forEach(function (key) {
                    images[key] = this.getImage(key);
                }, this);
            }

            var textItems = {};
            if (data.text || data.full) {
                textItems = generator.generateItems([1, 2, 3], {
                    useText: true,
                    action: this.events.showAction
                });
            }

            var progress = data.full || _.random(0,1) ? this.getProgress(true) : false;

            return {
                templateId: 'vp2c-2',
                backgroundImage: 'file:///templates/images/background-Pandora.png',
                templateContent: {
                    title: {
                        image: 'file:///templates/images/branding-pandora-header.png'
                    },
                    buttons: $.extend(true, buttons, {
                        7: {
                            image: this.getImage('back'),
                            action: this.events.goBack
                        }
                    }),
                    main: {
                        text: textItems,
                        images: images
                    },
                    progress: progress
                }
            };
        },

        getImage: function (name) {
            if (this.useSameImages) {
                return this.images[2];
            }

            if (this.useUniqueHugeImages) {
                return _.template(this.images.huge, {key: this.useUniqueHugeImages++});
            }

            return this.images[name];
        }
    });
});