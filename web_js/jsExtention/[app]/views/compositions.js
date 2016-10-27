define(function () {
    'use strict';

    return {

        // abstract item could be: button or text item
        getItemComposition: function () {
            return [{
                text: 'with icons',
                options: {
                    useImage: true
                }
            }, {
                text: 'with text+icons',
                options: {
                    useText: true,
                    useImage: true
                }
            }].concat(this.getTextComposition());
        },

        // could be applicable for: buttons, text items, titles, list items
        getTextComposition: function () {
            return [{
                text: 'long text',
                options: {
                    useLongText: true
                }
            }, {
                text: 'line-breaks: 1',
                options: {
                    useLineBreak: true,
                    howMany: 2
                }
            }, {
                text: 'line-breaks: 4',
                options: {
                    useLineBreak: true,
                    howMany: 5
                }
            }];
        },

        // TODO not used currently
        // could be applicable for: buttons, text items, titles, list items
        getCommonComposition: function () {
            return [{
                text: 'empty',
                options: {
                    empty: true
                }
            }];
        }
    };
});