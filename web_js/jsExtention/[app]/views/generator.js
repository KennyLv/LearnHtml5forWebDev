define(function () {
    'use strict';

    return {

        /**
         *
         * @param source {Array}
         *
         * @param options {Object}
         *
         * @param options.useImage use image
         * @param options.imageUrl use image
         *
         * @param options.useText use text
         * @param options.useLongText use long value as text
         *
         * @param options.useLineBreak use line-breaks
         * @param options.howMany how many line-breaks should be inserted
         *
         * @param options.isTextItem
         *
         * @returns {object}
         */
        generateItems: function (source, options) {
            var items = {};

            source.forEach(function (key, index) {
                items[key] = {
                    "action": options.action || this.events.showAction,
                    "value": 'Pressed item ' + key
                };

                if (options.useImage) {
                    items[key].image = _.isArray(options.image) ? options.image[index] : options.image;
                }

                if (options.usePressedState) {
                    items[key] = {
                        image: {
                            normal: _.isArray(options.image) ?
                                options.image[index] : options.image,
                            pressed: _.isArray(options.image) ?
                                (options.image[index + 1] || options.image[0]) : options.image
                        }
                    };
                }

                if (options.hoverIsActive) {
                    var backgroundImage;
                    if (key === 1) {
                        backgroundImage = {
                            'pressed': options.images.stripeBtnL
                        };
                    } else if (key === 6) {
                        backgroundImage = {
                            'pressed': options.images.stripeBtnR
                        };
                    } else {
                        backgroundImage = {
                            'pressed': options.images.stripeBtnC
                        };
                    }

                    items[key].backgroundImage = backgroundImage;
                }

                if (options.useText) {
                    items[key].text = _.range(0, 10).join('W');
                }

                if (options.useLongText) {
                    items[key].text = _.range(0, 200).join('W');
                }

                if (options.useLineBreak) {
                    options.howMany = options.howMany || 1;
                    items[key].text = _.range(0, options.howMany).map(function () {
                        return _.range(0, 10).join('W');
                    }).join('\n');
                }

                if (options.text && options.isTextItem) {
                    items[key].text = _.isArray(options.text) ? options.text[key - 1] : options.text;
                }
            }, this);

            return items;
        }

    };
});