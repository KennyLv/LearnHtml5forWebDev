define(['aq/eventEmitter', 'templates/views/compositions'], function (EventEmitter, compositions) {
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

            var fullButtonsStripe = _.range(1, 7),
                sideButtons = [8,9];

            var textItemsSample = [
                'Florence + The Machine Radio',
                'I Am Not a Robot',
                'Marina and The Diamonds'
            ];

            // buttons stripe - 1,6
            var buttons = _.range(1, 6).map(function (howMany) {
                return {
                    text: howMany + ' buttons',
                    value: {
                        template: 'samples/player',
                        data: {
                            image: 'file:///templates/images/main.png',
                            buttons: _.range(1, howMany + 1),
                            textItems: _.range(1, 4),
                            options: {
                                text: textItemsSample,
                                useImage: true
                            }
                        }
                    }
                };
            });

            var itemComposition = compositions.getItemComposition();

            // buttons composition + side buttons
            var buttonsComposition = itemComposition.map(function (item) {
                return {
                    text: 'Buttons ' + item.text,
                    value: {
                        template: 'samples/player',
                        data: {
                            image: 'file:///templates/images/main.png',
                            buttons: fullButtonsStripe.concat(sideButtons),
                            textItems: _.range(1, 4),
                            progress: {
                                playing: true
                            },
                            options: _.extend({
                                text: textItemsSample
                            }, item.options)
                        }
                    }
                };
            });

            // main image missed
            var imageMissed = [{
                text: 'Without main image',
                value: {
                    template: 'samples/player',
                    data: {
                        buttons: fullButtonsStripe,
                        options: {
                            useImage: true
                        }
                    }
                }
            }];

            // text items: 1, 2, 3
            var prefix = {
                1: '1st',
                2: '2nd',
                3: '3rd'
            };
            var text = _.flatten(_.map([3,2,1], function (key) {
                return _.map(itemComposition, function (composition) {
                    return {
                        text: prefix[key] + ' text - ' + composition.text,
                        value: {
                            template: 'samples/player',
                            data: _.extend({
                                image: 'file:///templates/images/main.png',
                                buttons: _.range(1, _.random(2, 9)),
                                textItems: _.range(1, key + 1)
                            }, composition)
                        }
                    };
                });
            }));

            // progress bar in playing or stopped state
            var progressBar = [{
                text: 'Progress Bar Playing',
                value: {
                    template: 'samples/player',
                    data: {
                        image: 'file:///templates/images/main.png',
                        buttons: fullButtonsStripe,
                        textItems: _.range(1, 4),
                        progress: {
                            playing: true
                        },
                        options: {
                            text: textItemsSample,
                            useImage: true
                        }
                    }
                }
            }, {
                text: 'Progress Bar Stopped',
                value: {
                    template: 'samples/player',
                    data: {
                        image: 'file:///templates/images/main.png',
                        buttons: fullButtonsStripe,
                        textItems: _.range(1, 4),
                        progress: {
                            playing: false
                        },
                        options: {
                            text: textItemsSample,
                            useImage: true
                        }
                    }
                }
            }, {
                text: 'With pressed state',
                value: {
                    template: 'samples/player',
                    data: {
                        image: 'file:///templates/images/main.png',
                        buttons: fullButtonsStripe,
                        textItems: _.range(1, 4),
                        progress: {
                            playing: false
                        },
                        options: {
                            text: textItemsSample,
                            useImage: true,
                            useHover: true
                        }
                    }
                }
            }];

            var items = progressBar.concat(imageMissed).concat(buttonsComposition)
                .concat(buttons).concat(text);

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