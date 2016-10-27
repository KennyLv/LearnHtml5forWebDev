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
                text: '1 button',
                value: {
                    template: 'samples/popup',
                    data: {
                        title: 'Popup',
                        main: 'with 1 button',
                        buttons: [2]
                    }
                }
            }, {
                text: '2 buttons',
                value: {
                    template: 'samples/popup',
                    data: {
                        title: 'Popup',
                        main: 'with 2 buttons',
                        buttons: [2,3]
                    }
                }
            }, {
                text: '3 buttons',
                value: {
                    template: 'samples/popup',
                    data: {
                        title: 'Popup',
                        main: 'with 3 buttons',
                        buttons: [4,5,6]
                    }
                }
            }, {
                text: '4 buttons',
                value: {
                    template: 'samples/popup',
                    data: {
                        title: 'Popup',
                        main: 'with 4 buttons (+ left close button)',
                        buttons: [1, 4, 5, 6]
                    }
                }
            }, {
                text: 'highlighted button',
                value: {
                    template: 'samples/popup',
                    data: {
                        title: 'Popup',
                        main: 'with 1 highlighted button',
                        buttons: [5, 6],
                        highlighted: true
                    }
                }
            }, {
                text: 'title missed',
                value: {
                    template: 'samples/popup',
                    data: {
                        main: 'Title missed',
                        buttons: [1,3]
                    }
                }
            }, {
                text: 'main text missed',
                value: {
                    template: 'samples/popup',
                    data: {
                        title: 'Popup',
                        buttons: [1,2]
                    }
                }
            }];

            return {
                templateId: 'vp2c-3',
                backgroundImage: 'file:///templates/images/black-bg.png',
                templateContent: {
                    title: $.t('Popups'),
                    list: _.map(items, function (item) {
                        return _.extend(item, {
                            action: this.events.goNext
                        });
                    }, this),
                    buttons: {
                        1: {
                            image: 'file:///templates/images/sidebtn_icon-back.png',
                            action: this.events.goBack
                        }
                    }
                }
            };
        }
    });
});