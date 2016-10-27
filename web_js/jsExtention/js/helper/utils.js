define(function () {
    'use strict';
    var currentLanguage = 'en';
    return {
    
		/**
		 * converts from km/h unit to meter/sec unit
		 * @param  {number} speed value in km/h
		 * @return {number}       value in meter/sec
		 */
		convertKmphtoMps: function (speed) {
			return speed*1000/3600;
		},

		/**
		 * converts from km/h unit to miles/h unit
		 * @param  {number} speed value in km/h
		 * @return {number}       value in miles/h
		 */
		convertKmphtoMph: function (speed) {
			return speed / 1.609344;
		},

		/**
		 * converts from miles/h unit to km/h unit
		 * @param  {number} speed value in miles/h
		 * @return {number}       value in km/h
		 */
		convertMphtoKmph: function (speed) {
			return speed * 1.609344;
		},
    
        /**
         * Parse a string as JSON. If the JSON is invalid, this function throws
         * a SyntaxError unless the safe option is set.
         *
         * @param {string} json The JSON string
         * @param {function} [reviver] prescribes how the value originally produced by parsing is transformed
         * @param {boolean} [safe=true] True to return null, false to throw an exception
         * @returns {object} returns the Object corresponding to the given JSON text or null
         */
        parseJSON: function (json, reviver, safe) {
            safe = safe !== false;

            try {
                return JSON.parse(json, reviver);
            } catch (e) {
                if (safe === true) {
                    return null;
                }
                throw e;
            }
        },
        /**
         * Convert value to JSON like string
         *
         * @param json {string|boolean|object}
         * @param [replacer] {function}
         * @param [space] {number}
         * @param [safe] {boolean} true by default. suppress any exceptions
         * @returns {json|error} return converted json or throw exception
         */
        toJSON: function (json, replacer, space, safe) {
            space = typeof space !== 'number' ? 2 : space;
            safe = safe !== false;

            try {
                var result = JSON.stringify(json, replacer, space);
                if (result === undefined) {
                    throw new Error('undefined cant be converted to json');
                }
                return result;
            } catch (e) {
                if (safe === true) {
                    return JSON.stringify({});
                }
                throw e;
            }
        },
        setLanguage: function (lang) {
            currentLanguage = lang;
        },
        getLanguage: function () {
            return currentLanguage;
        },
        /**
         * @param list {Array}
         */
        toObject: function (list) {
            return _.reduce(list, function (memo, val, index) {
                memo[index] = val;
                return memo;
            }, {});
        },
        /**
         * @fixme: This method should not be here because it is not a kind of general purpose util method
         */
        isReportDataEmpty: function (data) {
            return !_.contains(_.map(data, function (value) {
                return isFinite(value) && !_.isArray(value) ? false : _.isEmpty(value);
            }), false);
        },
        /**
         *
         * @returns {string} android || ios
         */
        getPlatform: function () {
            return this.platfrom || this._getPlatform();
        },
        _getPlatform: function () {
            var ios = /iPhone/i;

            this.platfrom = ios.test(window.navigator.userAgent) ? 'ios' : 'android';
            return this.platfrom;
        },
        isEqual: function (a, b) {
            return this.toJSON(a) === this.toJSON(b);
        },
        ellipsis: function (str, length) {
            str = typeof str !== 'string' ? '' : str;
            return str.length > length ? str.substring(0, length).concat('...') : str;
        },
        //Given: "软件大道147号lovely婚戒定制中心（安德门大街向里100米）"
        //Return: ["软件大道147号", "lovely婚戒定制中心", "（安德门大街向里", "100米）"]
        lineBreakByWidth: function (str, col) {
            var result = [];
            var currItem = '';
            var currSize = 0;

            //For english, size is 1 for lower-case, 2 for upper-case. For Chinese, it's size is 2.
            var getSize = function (str) {
                var count = 0;
                for (var x = 0; x < str.length; x++) {
                    var char = str[x];
                    if (/[A-Z]/.test(char)) {
                        count += 2;
                    } else if (/(\w|\s|\.|-)/.test(char)) {
                        count++;
                    } else {
                        count += 2;
                    }
                }

                return count;
            };

            var splitIndex = function (str) {
                if (/(\w|\（)/.test(str[str.length - 1])) {
                    for (var x = str.length - 1; x >= 0; x--) {
                        if (/(\w|\（)/.test(str[x]) === false) {
                            return x;
                        }
                    }
                }

                return -1;
            };

            //For each character at the end of the line break,
            // walk back and break where it matches a character boundary defined in splitIndex.
            for (var x = 0; x < str.length; x++) {
                var char = str[x];
                var charSize = getSize(char);
                if ((currSize + charSize) > col) {
                    //Now that the line break should happen here,
                    //use splitIndex to determine if we need to
                    //break at the characters before this one.
                    var iSplitIndex = splitIndex(currItem);
                    if (iSplitIndex >= 0) {

                        result.push(currItem.substr(0, iSplitIndex + 1));
                        currItem = currItem.substr(iSplitIndex + 1) + char;
                        currSize = getSize(currItem);
                    } else {
                        result.push(currItem);
                        currItem = char;
                        currSize = getSize(char);
                    }

                } else {
                    //Keep adding to the line until it's full
                    currItem += char;
                    currSize += getSize(char);
                }

                //Get whatever remaining in the item that
                //was not added to the result because of size limit is not reach
                if (x === (str.length - 1)) {
                    result.push(currItem);
                }
            }

            return result;
        },
        freeze: function (o) {
            return Object.freeze ? this._freeze(o) : o;
        },
        _freeze: function (o) {
            Object.freeze(o);

            Object.getOwnPropertyNames(o).forEach(function (prop) {
                if (o.hasOwnProperty(prop) && o[prop] !== null &&
                        (typeof o[prop] === "object") && !Object.isFrozen(o[prop])) {
                    this._freeze(o[prop]);
                }
            }, this);

            return o;
        },
        /**
         * Check that passed object contain given path
         *
         * @param o {Object}
         * @param p {String}
         */
        resolve: function (o, p) {
            o = Object.prototype.toString.call(o) === "[object Object]" ? o : {};

            var delimiter = ".",
                    path = String.prototype.split.call(p || "", delimiter);

            return path.reduce(function (obj, key) {
                return (obj !== undefined && obj !== null) ? obj[key] : obj;
            }, o);
        },

        getImageFromCache: function (cache, key) {
            return cache[key];
        },

        storeImageToCache: function (cache, key, data) {
            cache[key] = data;
            return true;
        },

        prettyDate: function (dateString, now) {
            var moment = window.moment;
            moment.locale(this.getLanguage());
            moment.relativeTimeThreshold('m', 60);
            moment.relativeTimeThreshold('h', 24);
            var mDate = moment(dateString);
            if (!mDate.isValid()) {
                return '';
            }
            var nowDate = now ? moment(now) : moment();
            if (nowDate.diff(mDate, 'days', true) < 1) {
                return mDate.from(nowDate);
            } else if (nowDate.diff(mDate, 'days', true) < 7) {
                return mDate.format('dddd');
            } else {
                return mDate.format('LL');
            }
        },

        //this function only for weibo app
        getLength: function (str) {
            var b = str.match(/[^\x00-\xff]/g);
            return parseInt(((str.length + (!b ? 0 : b.length))) / 2, 10);
        },
        //this function only for weibo app
        weiboEllipsis: function (str, length) {
            var strArray = str.split('');
            if (this.getLength(str) <= length) {
                return str;
            } else {
                str = strArray.join('');
                while (this.getLength(str) > length) {
                    strArray.pop();
                    str = strArray.join('');
                }
                return str.concat('...');
            }
        },

        ucfirst: function (str) {
            if (typeof str === 'string' && str.length > 0) {
                return str.charAt(0).toUpperCase() + str.substr(1);
            }
            return str;
        },

        checkDfdIsPending: function(dfd) {
            var isPending = false;
            if (dfd && typeof dfd.state === 'function' && dfd.state() === 'pending') {
                isPending = true;
            }
            return isPending;
        }
    };
});
