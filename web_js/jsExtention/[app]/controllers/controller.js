define(['aq/eventEmitter'], function (EventEmitter) {
    'use strict';

    return EventEmitter.extend({

        views: [],

        init: function (dic) {
            this.dic = dic;
            this.popup = dic.create('popup', {
                data: {
                    buttons: [5],
                    event: 'close'
                }
            });

            this.createRootView();
            this.view.display.showLoading();
        },

        createRootView: function () {
            this.view = this.dic.create('navigationList');
        },

        start: function (data) {
            if (!this.view) this.createRootView();

            this.view.render(data && data.value);

            this.startListening();
        },

        startListening: function () {
            this.listenTo(this.view.display, this.view.events.goNext, this.goNext);
            this.listenTo(this.view.display, this.view.events.showAction, this.showAction);

            this.listenTo(this.view.display, this.view.events.goBack, this.goBack);

            this.listenTo(this.view.display, this.view.display.getBackButtonEventName(), this.goBack);
        },

        close: function () {
            this.suspend();
        },

        suspend: function () {
            if (this.view) this.view.stopListening();
            if (this.popup) this.popup.stopListening();
            this.stopListening();
            this.views = [];
            this.view = null;
        },

        goNext: function (data) {
            if (!data || !data.value) return;

            this.views.push(this.view);

            this.stopListening();
            this.view = this.dic.create(data.value.template);

            this.start(data);
        },
        
        goBack: function () {
            this.stopListening();
            this.view = this.views.pop();

            return this.view ? this.start() : this.exit();
        },

        exit: function () {
            this.trigger('suspend');
        },

        showAction: function (data) {
            this.popup.render(null, data.value);
            this.listenToOnce(this.popup.display, this.popup.events.close, this.closePopup);
        },

        closePopup: function () {
            this.view.display.updateScreen(this.view.template);
            this.startListening();
        }
    });
});