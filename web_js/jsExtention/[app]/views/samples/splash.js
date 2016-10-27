define(['aq/eventEmitter'], function (EventEmitter) {
    'use strict';

    return EventEmitter.extend({

        events: {
            goNext: 'goNext',
            goBack: 'goBack'
        },

        init: function (display) {
            this.display = display;
        },

        render: function (options) {
            this.template = this.generateTemplate(options.data);
            this.display.updateScreen(this.template);
            setTimeout(this.goBackToList.bind(this), 10000);
        },

        goBackToList: function() {
            this.display.trigger('goBack');
        },

        generateTemplate: function () {

            var text = _.range(1, _.random(2, 4)).reduce(function (memo, key) {
                    memo[key] = new Array(_.random(1, 50)).join('w');
                    return memo;
                }, {}),

                mainImage = {
                    1: 'file:///templates/images/preview-' + _.random(1,4) + '.png'
                };

            return {
                templateId: 'vp2c-8',
                backgroundImage: 'file:///templates/images/black-bg.png',
                templateContent: {
                    main: {
                        text: text,
                        images: mainImage
                    }
                }
            };
        }

    });
});