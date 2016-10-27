define(['aq/eventEmitter'], function (EventEmitter) {
    'use strict';

    return EventEmitter.extend({

        events: {
            goBack: 'goBack',
            showAction: 'showAction',
            getContainerName: 'getContainerName',
            switchApp: 'switchApp'
        },

        init: function (display, appContainer) {
            this.display = display;
            this.appContainer = appContainer;
            this.template = this.generateTemplate();
        },

        render: function () {
            this.display.updateScreen(this.template);

            this.listenTo(this.display, {
                'goBack': this.onGoBack,
                'getContainerName': this.getContainerName,
                'switchApp': this.switchApp
            });
        },

        generateTemplate: function () {
            return {
                templateId: 'vp2c-5',
                backgroundImage: 'file:///templates/images/black-bg.png',
                templateContent: {
                    buttons: {
                        7: {
                            text: "getContainerName",
                            action: this.events.getContainerName
                        },
                        9: {
                            text: "switchApp",
                            action: this.events.switchApp
                        },
                        10: {
                            image: 'file:///templates/images/sidebtn_icon-back.png',
                            action: this.events.goBack
                        }
                    }
                }
            };
        },

        onGoBack: function () {
            this.stopListening();
        },

        getContainerName: function () {
            this.appContainer.getApplicationContainerName()
                .always(function (name) {
                    this.display.trigger('showAction', {value: name});
                }.bind(this));
        },

        switchApp: function () {
            this.appContainer.switchApplicationContainerTo('Pandora');
        }

    });
});