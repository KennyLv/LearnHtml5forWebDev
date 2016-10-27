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
                text: 'Full page with all images, text, and buttons',
                value: {
                    template: 'samples/litePlayer',
                    data: {
                        full: true
                    }
                }
            }, {
                text: 'BackgroundImage f/buttons',
                value: {
                    template: 'samples/litePlayer',
                    data: {
                        full: true,
                        useHover: true
                    }
                }
            },/* {
                text: 'The page with all unique huge images',
                value: {
                    template: 'samples/litePlayer',
                    data: {
                        full: true,
                        options: {
                            useUniqueHugeImages: true
                        }
                    }
                }
            },*/ {
                text: 'Pressed state f/buttons',
                value: {
                    template: 'samples/litePlayer',
                    data: {
                        full: true,
                        options: {
                            usePressedState: true
                        }
                    }
                }
            }, {
                text: 'All text only with single back button',
                value: {
                    template: 'samples/litePlayer',
                    data: {
                        text: true
                    }
                }
            }, {
                text: 'All image only with single back button',
                value: {
                    template: 'samples/litePlayer',
                    data: {
                        images: true
                    }
                }
            }, {
                text: 'All buttons only',
                value: {
                    template: 'samples/litePlayer',
                    data: {
                        buttons: true
                    }
                }
            }
            /* {
                text: 'The page with all same images',
                value: {
                    template: 'samples/litePlayer',
                    data: {
                        full: true,
                        options: {
                            useSameImages: true
                        }
                    }
                }
            },*/
            ];


            return {
                templateId: 'vp2c-3',
                backgroundImage: 'file:///templates/images/black-bg.png',
                templateContent: {
                    title: $.t('Players'),
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