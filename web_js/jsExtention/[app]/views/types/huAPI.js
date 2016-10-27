define(['aq/eventEmitter'], function (EventEmitter) {
    'use strict';

    return EventEmitter.extend({

        events: {
            goBack: 'onGoBack',
            request: 'onRequestAudioFocus',
            release: 'onReleaseAudioFocus',
            cacheImages: 'onCacheImages',
            deleteImages: 'onDeleteImages',
            getLanguage: 'onGetLanguage',
            getVehicleState: 'onGetVehicleState',
            goToKeyboard: 'onGoToKeyboard',
            goToMediaSource: 'onGoToMediaSource',
            startListenToScroll: 'startListenToScroll',
            stopListenToScroll: 'stopListenToScroll'
        },

        init: function (display, audio, storage, navigation, profile) {
            this.display = display;

            this.audio = audio;
            this.storage = storage;
            this.navigation = navigation;
            this.profile = profile;

            this.template = this.generateTemplate();
        },

        render: function () {
            this.display.updateScreen(this.template);
            this.startListening();
        },

        startListening: function () {
            _.each(this.events, function (fn) {
                if (this[fn]) {
                    this.listenTo(this.display, fn, this[fn].bind(this));
                }
            }, this);
        },

        generateTemplate: function () {
            return {
                templateId: 'vp2c-3',
                backgroundImage: 'file:///templates/images/black-bg.png',
                templateContent: {
                    title: $.t('HU API'),
                    list: this.getListItems(),
                    buttons: {
                        1: {
                            image: 'file:///templates/images/sidebtn_icon-back.png',
                            text: $.t('back'),
                            action: this.events.goBack
                        }
                    }
                }
            };
        },

        getListItems: function () {
            return [{
                text: 'Request Audio focus',
                action: this.events.request
            }, {
                text: 'Release Audio focus',
                action: this.events.release
            }, {
                text: 'Cache Images',
                action: this.events.cacheImages
            }, {
                text: 'Delete Images',
                action: this.events.deleteImages
            }, {
                text: 'Get Language',
                action: this.events.getLanguage
            }, {
                text: 'Get Vehicle state',
                action: this.events.getVehicleState
            }, {
                text: 'Go To Keyboard',
                action: this.events.goToKeyboard
            }, {
                text: 'Go To Media Source',
                action: this.events.goToMediaSource
            }, {
                text: 'Start listen to scroll',
                action: this.events.startListenToScroll
            }, {
                text: 'Stop listen to scroll',
                action: this.events.stopListenToScroll
            }];
        },

        onGoBack: function () {
            this.stopListening();
        },

        stopListenToScroll: function () {
            this.display.stopListenTo(this.display.getScrollEventName());
        },

        startListenToScroll: function () {
            this.display.startListenTo(this.display.getScrollEventName());
        },

        onRequestAudioFocus: function () {
            // todo add success handler
            this.audio.focus().done(function () {});
        },

        onReleaseAudioFocus: function () {
            // todo add success handler
            this.audio.releaseFocus().done(function () {});
        },

        onCacheImages: function () {
            this.display.screen.cacheImages(this._getImageIds());
        },

        onDeleteImages: function () {
            this.display.screen.invalidateImagesCache(this._getImageIds());
        },

        onGetLanguage: function () {
            this.profile.getLanguage();
        },

        onGetVehicleState: function () {
            this.navigation.getVehicleState();
        },

        onGoToKeyboard: function () {
            this.display.showKeyboard();
        },

        onGoToMediaSource: function () {
            this.display.showMediaSourceScreen();
        },

        _getImageIds: function () {
            var images = _.range(1, 10).map(function (id) {
                return 'file:///templates/images/stripe/'.concat(id).concat('.png');
            });

            return images.map(function (image) {
                return this.storage.getImageId({
                    data: image
                });
            }, this);
        }

    });
});