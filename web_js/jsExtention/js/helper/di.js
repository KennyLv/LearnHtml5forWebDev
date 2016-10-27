/**
 * Example of usage:
 * @example
 * <pre>
 * new Dic({
 *
 *   name: {
 *     module: require('path/to/module'),
 *     dependencies: [
 *       require('path/to/dependency')
 *     ],
 *     register: true|false, // true by default
 *     create: true|false,  // false by default
 *   },
 *
 *   module: function () {
 *     return <any>;
 *   }
 *
 * });
 * </pre>
 *
 * where a 'name' key is the name of factory
 */
define(['js/helper/dic-lib'], function (Di) {
    'use strict';

    /**
     *
     * @param name {String}
     * @param options
     * @returns {*}
     */
    Di.prototype.get = function (name, options) {

        var factory = this.factories[name];

        if (!factory) {
            throw new Error('Unknown type "' + name + '"');
        }

        if (this.registry[name]) {
            return this.registry[name];
        }

        if (_.isFunction(factory)) {
            return factory.call(this, options);
        }

        // inject dependencies from configuration, pass them into constructor
        var dependencies = _.isArray(factory.dependencies) ? [null].concat(factory.dependencies) : [null];
        var Module = factory.module.bind ? factory.module.bind.apply(factory.module, dependencies) : factory.module;

        if (factory.create) {
            Module = new Module(options);
        }

        // save into registry
        if (factory.register !== false) {
            this.registry[name] = Module;
        }

        return Module;
    };

    /**
     *
     * @param name {string}
     * @param [options] {object}
     * @returns {object}
     */
    Di.prototype.create = function (name, options) {
        var Module = this.registry[name] || this.get(name, options);
        return _.isFunction(Module) ? (this.registry[name] = new Module(options)) : Module;
    };

    /**
     * Invoke "start" method in all registered modules
     */
    Di.prototype.start = function () {
        this._invoke('start');
    };

    /**
     * Invoke "suspend" method in all registered modules
     */
    Di.prototype.suspend = function () {
        this._invoke('suspend');
    };

    /**
     * Invoke "close" method in all registered modules
     */
    Di.prototype.close = function () {
        this._invoke('close');
    };

    Di.prototype._invoke = function (method) {
        _.each(this.registry, function (module) {
            if (module[method]) {
                module[method]();
            }
        });
    };

    return Di;
});
