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

            // All buttons only
            var buttons = [{
                text: 'All buttons only',
                value: {
                    template: 'samples/list',
                    data: {
                        buttons: [1, 2, 3, 4, 7, 8]
                    }
                }
            }];

            // left buttons 1 - 5
            buttons = buttons.concat(_.range(1, 6).map(function (howMany) {
                return {
                    text: 'Buttons ' + [1, howMany].join('-'),
                    value: {
                        template: 'samples/list',
                        data: {
                            buttons: _.range(1, howMany + 1)
                        }
                    }
                };
            }));

            // right buttons 7 - 10, scroll buttons excluded
            buttons = buttons.concat([7, 8, 10].map(function (howMany) {
                return {
                    text: 'Button ' + howMany,
                    value: {
                        template: 'samples/list',
                        data: {
                            buttons: [howMany]
                        }
                    }
                };
            }));

            // only 3 items in list
            var scrollDownDisabled = [{
                text: 'scroll down disabled',
                value: {
                    template: 'samples/list',
                    data: {
                        items: 3,
                        buttons: [1]
                    }
                }
            }];

            var leftImageIcon = [{
                text: 'left images',
                value: {
                    template: 'samples/list',
                    data: {
                        items: 20,
                        buttons: [1],
                        options: {
                            leftImage: 'file:///templates/images/32x32.png'
                        }
                    }
                }
            }];

            var rightImageIcon = [{
                text: 'right images',
                value: {
                    template: 'samples/list',
                    data: {
                        items: 20,
                        buttons: [1],
                        options: {
                            rightImage: 'file:///templates/images/32x32.png'
                        }
                    }
                }
            }];

            var bothSideImageIcons = [{
                text: 'left and right images',
                value: {
                    template: 'samples/list',
                    data: {
                        items: 20,
                        buttons: [1],
                        options: {
                            rightImage: 'file:///templates/images/32x32.png',
                            leftImage: 'file:///templates/images/32x32.png'
                        }
                    }
                }
            }];

            var items = buttons.concat(scrollDownDisabled).concat(leftImageIcon)
                .concat(rightImageIcon).concat(bothSideImageIcons);

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