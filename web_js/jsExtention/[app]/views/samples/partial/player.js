define([
    'aq/eventEmitter',
    'templates/views/types/players', 'templates/views/samples/player'
], function (EventEmitter, Players, Player) {
    'use strict';

    return EventEmitter.extend({

        events: {
            goNext: 'goNext',
            goBack: 'goBack',
            showAction: 'showAction'
        },

        init: function (display) {
            this.display = display;
            this.templates = this.generateTemplates();
            this.currentTemplate = 0;
        },

        render: function () {
            var tpl = this.templates[this.currentTemplate++];

            if (tpl) {
                // todo workaround, render it later to avoid events bubbling to controller
                _.defer(this._render.bind(this, tpl));
            }
        },

        _render: function (tpl) {
            this.display.updateScreen(tpl);

            this.listenTo(this.display, this.events.showAction, this.render);
            this.listenTo(this.display, this.events.goNext, this.render);
            this.listenTo(this.display, this.events.goBack, this.renderPrev);
        },

        renderPrev: function () {
            this.currentTemplate -= 2;
            this.render();
        },

        generateTemplates: function () {
            var playerTypes = new Players().template.templateContent.list,
                playerTpl = new Player();

            this.templates = [];

            _.each(playerTypes, function (item) {
                this.templates.push(
                    playerTpl.generateTemplate(item.value.data)
                );
            }, this);


            return this.templates;
        }

    });
});