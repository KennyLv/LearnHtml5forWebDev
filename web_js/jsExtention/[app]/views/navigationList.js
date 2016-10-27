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
                text: 'VP2C-1: Popups',
                value: {
                    template: 'types/popups'
                }
            },{
                text: 'VP2C-2: Players',
                value: {
                    template: 'types/litePlayers'
                }
            },{
                text: 'VP2C-3: Lists',
                value: {
                    template: 'types/lists'
                }
            }, {
                text: 'VP2C-5: Controls',
                value: {
                    template: 'types/controls'
                }
            },{
                text: 'VP2C-6: Players',
                value: {
                    template: 'types/players'
                }
            }, {
                text: 'VP2C-7: Popups',
                value: {
                    template: 'types/previews'
                }
            }, {
                text: 'VP2C-8: Splash Screens',
                value: {
                    template: 'types/splashes'
                }
            }, {
                text: 'Test: PartialUpdate',
                value: {
                    template: 'types/partial'
                }
            }, {
                text: 'Test: HU API',
                value: {
                    template: 'types/huAPI'
                }
            }, {
                text: 'Test: appSwitch',
                value: {
                    template: 'types/appSwitch'
                }
            }];

            return {
                templateId: 'vp2c-3',
                backgroundImage: 'file:///templates/images/black-bg.png',
                templateContent: {
                    title: $.t('Test Suite'),
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