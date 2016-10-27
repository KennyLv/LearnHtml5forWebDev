/**
 * Dependency Injection class.
 * This class will be used to create components instances and store links to them
 */
define(function() {
	/**
	 * Dependency Injection container constructor
	 * @name Dic
	 * @constructor
	 *
	 * @param {Object} factories keys represent object name, values are factory methods
	 *
	 * @example
	 * {
	 *   className: function(options){
	 *      // if it should be a singleton, save it to this.registry['className']
	 *      if (this.registry['className']) {
	 *          return this.registry['className'];
	 *      }
	 *
	 *      // construct instance of className
	 *      return instance;
	 *   }
	 * }
	 */
	function Dic(factories) {
		this.factories = factories;
		this.registry = {};
	}

	/**
	 * Create instance using factory by type name
	 * @name Dic#getInstance
	 * @function
	 *
	 * @param  {string} name - singleton instance name
	 * @param  {Object} [options]
	 * @returns {mixed}
	 */
	Dic.prototype.getInstance = function(name, options) {
		if (!this.factories[name]) {
			throw new Error('Unknown type "' + name + '"');
		}

		return this.factories[name].call(this, options);
	};

	/**
	 * Create instance using factory by type name
	 * @name Dic#getInstance
	 * @function
	 *
	 * @param  {string} name - singleton instance name
	 * @param  {Object} [options]
	 * @returns {mixed}
	 */
	Dic.prototype.get = function(name, options) {
		return this.getInstance(name, options);
	};

	/**
	 * @deprecated
	 * This method should no longer be used.
	 * Save instance to the registry in factory method instead.
	 *
	 * Get instance from singletons registry.
	 * If there is no instance in registry new instance will be created and putted to registry
	 * @name Dic#getSingleton
	 * @function
	 *
	 * @param  {string} name - singleton instance name
	 * @param  {Object} options [optional]
	 * @returns {mixed}
	 */
	Dic.prototype.getSingleton = function(name, options) {
		if (!this.registry[name]) {
			this.registry[name] = this.getInstance(name, options);
		}

		return this.registry[name];
	};

	/**
	 * Adds speficied factories to the container
	 * @param {Object} extraFactories Hash of factories, format the same as for constructor
	 */
	Dic.prototype.addFactories = function(extraFactories) {
		for (var name in extraFactories) {
			this.addFactory(name, extraFactories[name]);
		}
	};

	/**
	 * Adds one factory to the container
	 * @param {string} name    Factory name
	 * @param {Object} factory Factory method
	 */
	Dic.prototype.addFactory = function(name, factory) {
		this.factories[name] = factory;
	};

	return Dic;
});