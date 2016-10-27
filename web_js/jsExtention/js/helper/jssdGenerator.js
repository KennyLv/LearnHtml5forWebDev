/*
 *   Parse messages passed into logger.js and out put JS Sequence Diagram (jssd) compatible log message.
 *
 *   When logger is enable, jssd string are also output into the log.
 *   User can use the command below to extract just jssd from log then
 *   put it into this website to get the sequence diagrams.
 *
 *   Sequence Diagram Generator: https://www.websequencediagrams.com/
 */
define(function () {
    'use strict';

    var jssd = {
        CONSTANT: {
            LINE: {
                DEFAULT: '->',
                NORMAL: '->',
                DASH: '-->',
                OPEN_ARROW: '->>'
            },
            NOTE_LINE: {
                L_OF: 'Note left of',
                R_OF: 'Note right of',
                OVER: 'Note over'
            },
            PART: 'participant',

            COMPONENTS: {
                HAP: 'HAP',
                HUP: 'HUP',
                PARTNER: 'PARTNER',
                CHOREO: 'CHOREO'
            },

            PATHS_TO_COMP: {
                '/hap/api/1.0/headunit/event': 'HUP',
                '/hap/api/1.0/thor/event': 'HUP',
                '/hap/api/1.0/handsetProfile': 'HAP',
                '/hap/api/1.0/location':  'HAP',
                '/hap/api/1.0/thorState': 'HAP',
                '/hap/api/1.0/profile': 'CHOREO',
                '/hap/api/1.0/meha/event': 'PARTNER',
                '/hap/api/1.0/meha': 'PARTNER'
            }
        },

        CONFIG: {
            SHOW_TIMESTAMP: false
        },

        participants: [],
        prefixType: {
            transport: ['[Transport][onNotification]', '[Transport][onSendRequest]']
        },

        _isExternal: false,
        _prefix: '',
        _data: {},
        _result: {dir: '', msg: ''},

        _firstTimestamp: 0,
        _lastTimestamp: 0,

        init: function (data) {
            this._prefix = Object.keys(data)[0];
            this._data = data[this._prefix];
            this.setInputType();
        },

        /**
         *
         *
         * @param data
         */
        setInput: function () {
            this._result = {
                dir: this.buildDirective(),
                msg: this.buildMsg()
            };
            if (this.CONFIG.SHOW_TIMESTAMP) {
                this._firstTimestamp = this.getTimestamp();
            }
        },

        getTimestamp: function () {
            return +(new Date());
        },

        getJssdFormattedString: function () {
            return this._result.dir + ': ' + this._result.msg;
        },

        getJssdFormattedTag: function () {
            return '<jssd>' + this._result.dir + ': ' + this._result.msg + '</jssd>';
        },

        setInputType: function () {
            //External Response
            if (this.prefixType.transport.indexOf(this._prefix) === 0) {
                this._isExternal = true;

            //External Request
            } else if (this.prefixType.transport.indexOf(this._prefix) === 1) {
                this._isExternal = true;
            //Internal Messaging
            } else {
                this._isExternal = false;
            }
        },

        /**
         * @return {string} [ex: NodeA ->> NodeB]
         */
        buildDirective: function () {
            var result = null;

            //External Messaging
            if (this._isExternal) {
                result = this.onParseExternalPrefix();
            //Internal Messaging
            } else {
                result = this.onParseInternalPrefix();
            }

            return result;
        },

        /**
         * [buildMsg description]
         * @return {string} [description]
         */
        buildMsg: function () {
            var result = '';

            //Return path some key content data
            if (this._isExternal) {
                result = _.map(this.onParseExternalMsg(), function (item) {
                        return '[' + item + ']';
                    }).join('');
            } else {
                result = _.map(this.onParseInternalMsg(), function (item) {
                    return '[' + item + ']';
                }).join('');
            }

            return result;
        },

        onParseInternalMsg: function () {
            return JSON.stringify(this._data);
        },

        onParseExternalMsg: function () {
            var data = this._data,
                requestNum = data.hasOwnProperty('requestNumber') ? data.requestNumber : '_',
                //sequenceNumber = data.hasOwnProperty('sequenceNumber') ? ''+data.sequenceNumber : '_',
                result = [];

            if (this._firstTimestamp) {
                if (!this._lastTimestamp) {
                    result.push('ts:' + this._firstTimestamp);
                } else {
                    result.push('tsDif:' + (this.getTimestamp() - this._lastTimestamp));
                }
                this._lastTimestamp = this.getTimestamp();
            }
            //Prefix requestNumber to message if possible
            result.push('r:' + requestNum);

            //External events
            if (data.path) {
                var pathItems = data.path.split('/');
                var contentItems = data.content && (data.content.type ||
                                    data.content.state ||
                                    data.content.cmd || //iHR command
                                    data.content.control || //Slacker command
                                    data.content.event ||
                                    data.content.eventId ||
                                    data.content.msgID ||
                                    (data.content.data && data.content.data.buttonType) ||
                                    '');
                result.push(pathItems.splice(pathItems.length - 2).join('/'));
                if (contentItems) {
                    result.push(contentItems);

                    //Add screen id to screenupdate stuff
                    if (data.content.data && data.content.data.screenId) {
                        result.push('screenId=' + data.content.data.screenId);
                    }

                //Android (lower case) and iOS (uppercase) diff
                } else if (data.headers && data.headers.hasOwnProperty('content-type')) {
                    result.push(data.headers['content-type']);

                //Android (lower case) and iOS (uppercase) diff
                } else if (data.headers && data.headers.hasOwnProperty('content-type')) {
                    result.push(data.headers['Content-Type']);

                }

            //iOS partner app response
            } else if (data.headers && data.headers.hasOwnProperty('App-Name')) {
                result.push(data.content && (
                            data.content.control || //Slacker command
                            (data.content.status && data.content.status.description) ||
                            ''));

            } else if (data.content && (data.content.control || data.content.ihrcp)) {
                result.push(data.content && (
                            data.content.control || //Slacker command
                            (data.content.status && data.content.status.description) ||
                            ''));

            } else if (data.code === 200 && (data.reason || data.status)) {
                result.push(data.reason || data.status);
            } else {
                result.push(JSON.stringify(data));
            }

            return result;
        },

        onParseInternalPrefix: function () {
            var result = ['HMI'];
            result.push(this.CONSTANT.NOTE_LINE.OVER);
            result = result.reverse();
            this._isExternal = false;

            result = result || [];

            return result.join(' ');
        },

        onParseExternalPrefix: function () {
            var prefix = this._prefix,
                result = ['HMI'];

            //Notifcation
            if (this.prefixType.transport.indexOf(prefix) === 0) {
                if (this._data.hasOwnProperty('requestNumber')) {
                    result.push(this.CONSTANT.LINE.NORMAL);
                } else {
                    result.push(this.CONSTANT.LINE.DASH);
                }

                result.push(this.getComponentFromData());
                result = result.reverse();
                //Request
            } else if (this.prefixType.transport.indexOf(prefix) === 1) {
                //Nothing to do for now
                result.push(this.CONSTANT.LINE.DEFAULT);
                result.push(this.getComponentFromData());
            }

            return result.join(' ');
        },

        isExternal: function () {
            return this._isExternal;
        },

        getComponentFromData: function () {
            var result = this.CONSTANT.PATHS_TO_COMP[this._data.path];

            //Override case where HMI send screenUpdate and HAP confirm with notif as if it's coming from HUP.
            if (result === this.CONSTANT.COMPONENTS.HUP &&
                this.prefixType.transport.indexOf(this._prefix) === 0 &&
                this._data.content && this._data.content.type === 'screenUpdate') {
                result = this.CONSTANT.COMPONENTS.HAP;
            //iOS override partner app responses
            } else if (!result && this._data.headers &&
                this._data.headers.hasOwnProperty('App-Name')) {

                result = this.CONSTANT.COMPONENTS.PARTNER;

            //android override partner app responses
            } else if (!result &&  this._data.content &&
                    (this._data.content.control || this._data.content.ihrcp)) {
                result = this.CONSTANT.COMPONENTS.PARTNER;
            }

            return result || this.CONSTANT.COMPONENTS.HAP;
        },

        getEndPointFromData: function () {
            if (this._data.content) {
                return this._data.type || this._data.state || '';
            } else {
                return '';
            }
        }
    };

    return {

        init: function (data) {
            jssd.init(data);
            return this;
        },

        translate: function () {
            jssd.setInput(this.data);
            return this;
        },

        isExternal: function () {
            return jssd.isExternal();
        },

        getString: function () {
            return JSON.stringify({jssd: jssd.getJssdFormattedString()}, null, 2);
        },

        getTag: function () {
            //return jssd string wrapped in <jssd /> tag which can be
            //pipe to only show jssd string for example below.
            //adb logcat -v time | sed -n 's/.*<jssd>\(.*\)<\/jssd>.*/\1/p'
            return {jssd: jssd.getJssdFormattedTag()};
        }
    };
});
