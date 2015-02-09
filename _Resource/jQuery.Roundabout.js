/**
 * jQuery Roundabout - v2.4.2
 * http://fredhq.com/projects/roundabout
 *
 * Moves list-items of enabled ordered and unordered lists long
 * a chosen path. Includes the default "lazySusan" path, that
 * moves items long a spinning turntable.
 *
 * Terms of Use // jQuery Roundabout
 *
 * Open source under the BSD license
 *
 * Copyright (c) 2011-2012, Fred LeBlanc
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 *   - Redistributions of source code must retain the above copyright
 *     notice, this list of conditions and the following disclaimer.
 *   - Redistributions in binary form must reproduce the above
 *     copyright notice, this list of conditions and the following
 *     disclaimer in the documentation and/or other materials provided
 *     with the distribution.
 *   - Neither the name of the author nor the names of its contributors
 *     may be used to endorse or promote products derived from this
 *     software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 * ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE
 * LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
 * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
 * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
 * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
 * CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
 * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 * POSSIBILITY OF SUCH DAMAGE.
 */
(function($) {
    "use strict";

    var defaults, internalData, methods;

    // add default shape
    $.extend({
        roundaboutShapes: {
            def: "lazySusan",
            lazySusan: function (r, a, t) {
                return {
                    x: Math.sin(r + a),
                    y: (Math.sin(r + 3 * Math.PI / 2 + a) / 8) * t,
                    z: (Math.cos(r + a) + 1) / 2,
                    scale: (Math.sin(r + Math.PI / 2 + a) / 2) + 0.5
                };
            }
        }
    });

    defaults = {
        bearing: 0.0,
        tilt: 0.0,
        minZ: 100,
        maxZ: 280,
        minOpacity: 0.4,
        maxOpacity: 1.0,
        minScale: 0.4,
        maxScale: 1.0,
        duration: 600,
        btnNext: null,
        btnNextCallback: function() {},
        btnPrev: null,
        btnPrevCallback: function() {},
        btnToggleAutoplay: null,
        btnStartAutoplay: null,
        btnStopAutoplay: null,
        easing: "swing",
        clickToFocus: true,
        clickToFocusCallback: function() {},
        focusBearing: 0.0,
        shape: "lazySusan",
        debug: false,
        childSelector: "li",
        startingChild: null,
        reflect: false,
        floatComparisonThreshold: 0.001,
        autoplay: false,
        autoplayDuration: 1000,
        autoplayPauseOnHover: false,
        autoplayCallback: function() {},
        autoplayInitialDelay: 0,
        enableDrag: false,
        dropDuration: 600,
        dropEasing: "swing",
        dropAnimateTo: "nearest",
        dropCallback: function() {},
        dragAxis: "x",
        dragFactor: 4,
        triggerFocusEvents: true,
        triggerBlurEvents: true,
        responsive: false
    };

    internalData = {
        autoplayInterval: null,
        autoplayIsRunning: false,
        autoplayStartTimeout: null,
        animating: false,
        childInFocus: -1,
        touchMoveStartPosition: null,
        stopAnimation: false,
        lastAnimationStep: false
    };

    methods = {

        // starters
        // -----------------------------------------------------------------------

        // init
        // starts up roundabout
        init: function(options, callback, relayout) {
            var settings,
                now = (new Date()).getTime();

            options   = (typeof options === "object") ? options : {};
            callback  = ($.isFunction(callback)) ? callback : function() {};
            callback  = ($.isFunction(options)) ? options : callback;
            settings  = $.extend({}, defaults, options, internalData);

            return this
                .each(function() {
                    // make options
                    var self = $(this),
                        childCount = self.children(settings.childSelector).length,
                        period = 360.0 / childCount,
                        startingChild = (settings.startingChild && settings.startingChild > (childCount - 1)) ? (childCount - 1) : settings.startingChild,
                        startBearing = (settings.startingChild === null) ? settings.bearing : 360 - (startingChild * period),
                        holderCSSPosition = (self.css("position") !== "static") ? self.css("position") : "relative";

                    self
                        .css({  // starting styles
                            padding:   0,
                            position:  holderCSSPosition
                        })
                        .addClass("roundabout-holder")
                        .data(  // starting options
                            "roundabout",
                            $.extend(
                                {},
                                settings,
                                {
                                    startingChild: startingChild,
                                    bearing: startBearing,
                                    oppositeOfFocusBearing: methods.normalize.apply(null, [settings.focusBearing - 180]),
                                    dragBearing: startBearing,
                                    period: period
                                }
                            )
                        );

                    // unbind any events that we set if we're relaying out
                    if (relayout) {
                        self
                            .unbind(".roundabout")
                            .children(settings.childSelector)
                            .unbind(".roundabout");
                    } else {
                        // bind responsive action
                        if (settings.responsive) {
                            $(window).bind("resize", function() {
                                methods.stopAutoplay.apply(self);
                                methods.relayoutChildren.apply(self);
                            });
                        }
                    }

                    // bind click-to-focus
                    if (settings.clickToFocus) {
                        self
                            .children(settings.childSelector)
                            .each(function(i) {
                                $(this)
                                    .bind("click.roundabout", function() {
                                        var degrees = methods.getPlacement.apply(self, [i]);

                                        if (!methods.isInFocus.apply(self, [degrees])) {
                                            methods.stopAnimation.apply($(this));
                                            if (!self.data("roundabout").animating) {
                                                methods.animateBearingToFocus.apply(self, [degrees, self.data("roundabout").clickToFocusCallback]);
                                            }
                                            return false;
                                        }
                                    });
                            });
                    }

                    // bind next buttons
                    if (settings.btnNext) {
                        $(settings.btnNext)
                            .bind("click.roundabout", function() {
                                if (!self.data("roundabout").animating) {
                                    methods.animateToNextChild.apply(self, [self.data("roundabout").btnNextCallback]);
                                }
                                return false;
                            });
                    }

                    // bind previous buttons
                    if (settings.btnPrev) {
                        $(settings.btnPrev)
                            .bind("click.roundabout", function() {
                                methods.animateToPreviousChild.apply(self, [self.data("roundabout").btnPrevCallback]);
                                return false;
                            });
                    }

                    // bind toggle autoplay buttons
                    if (settings.btnToggleAutoplay) {
                        $(settings.btnToggleAutoplay)
                            .bind("click.roundabout", function() {
                                methods.toggleAutoplay.apply(self);
                                return false;
                            });
                    }

                    // bind start autoplay buttons
                    if (settings.btnStartAutoplay) {
                        $(settings.btnStartAutoplay)
                            .bind("click.roundabout", function() {
                                methods.startAutoplay.apply(self);
                                return false;
                            });
                    }

                    // bind stop autoplay buttons
                    if (settings.btnStopAutoplay) {
                        $(settings.btnStopAutoplay)
                            .bind("click.roundabout", function() {
                                methods.stopAutoplay.apply(self);
                                return false;
                            });
                    }

                    // autoplay pause on hover
                    if (settings.autoplayPauseOnHover) {
                        self
                            .bind("mouseenter.roundabout.autoplay", function() {
                                methods.stopAutoplay.apply(self, [true]);
                            })
                            .bind("mouseleave.roundabout.autoplay", function() {
                                methods.startAutoplay.apply(self);
                            });
                    }

                    // drag and drop
                    if (settings.enableDrag) {
                        // on screen
                        if (!$.isFunction(self.drag)) {
                            if (settings.debug) {
                                alert("You do not have the drag plugin loaded.");
                            }
                        } else if (!$.isFunction(self.drop)) {
                            if (settings.debug) {
                                alert("You do not have the drop plugin loaded.");
                            }
                        } else {
                            self
                                .drag(function(e, properties) {
                                    var data = self.data("roundabout"),
                                        delta = (data.dragAxis.toLowerCase() === "x") ? "deltaX" : "deltaY";
                                    methods.stopAnimation.apply(self);
                                    methods.setBearing.apply(self, [data.dragBearing + properties[delta] / data.dragFactor]);
                                })
                                .drop(function(e) {
                                    var data = self.data("roundabout"),
                                        method = methods.getAnimateToMethod(data.dropAnimateTo);
                                    methods.allowAnimation.apply(self);
                                    methods[method].apply(self, [data.dropDuration, data.dropEasing, data.dropCallback]);
                                    data.dragBearing = data.period * methods.getNearestChild.apply(self);
                                });
                        }

                        // on mobile
                        self
                            .each(function() {
                                var element = $(this).get(0),
                                    data = $(this).data("roundabout"),
                                    page = (data.dragAxis.toLowerCase() === "x") ? "pageX" : "pageY",
                                    method = methods.getAnimateToMethod(data.dropAnimateTo);

                                // some versions of IE don't like this
                                if (element.addEventListener) {
                                    element.addEventListener("touchstart", function(e) {
                                        data.touchMoveStartPosition = e.touches[0][page];
                                    }, false);

                                    element.addEventListener("touchmove", function(e) {
                                        var delta = (e.touches[0][page] - data.touchMoveStartPosition) / data.dragFactor;
                                        e.preventDefault();
                                        methods.stopAnimation.apply($(this));
                                        methods.setBearing.apply($(this), [data.dragBearing + delta]);
                                    }, false);

                                    element.addEventListener("touchend", function(e) {
                                        e.preventDefault();
                                        methods.allowAnimation.apply($(this));
                                        method = methods.getAnimateToMethod(data.dropAnimateTo);
                                        methods[method].apply($(this), [data.dropDuration, data.dropEasing, data.dropCallback]);
                                        data.dragBearing = data.period * methods.getNearestChild.apply($(this));
                                    }, false);
                                }
                            });
                    }

                    // start children
                    methods.initChildren.apply(self, [callback, relayout]);
                });
        },


        // initChildren
        // applys settings to child elements, starts roundabout
        initChildren: function(callback, relayout) {
            var self = $(this),
                data = self.data("roundabout");

            callback = callback || function() {};

            self.children(data.childSelector).each(function(i) {
                var startWidth, startHeight, startFontSize,
                    degrees = methods.getPlacement.apply(self, [i]);

                // on relayout, grab these values from current data
                if (relayout && $(this).data("roundabout")) {
                    startWidth = $(this).data("roundabout").startWidth;
                    startHeight = $(this).data("roundabout").startHeight;
                    startFontSize = $(this).data("roundabout").startFontSize;
                }

                // apply classes and css first
                $(this)
                    .addClass("roundabout-moveable-item")
                    .css("position", "absolute");

                // now measure
                $(this)
                    .data(
                    "roundabout",
                    {
                        startWidth: startWidth || $(this).width(),
                        startHeight: startHeight || $(this).height(),
                        startFontSize: startFontSize || parseInt($(this).css("font-size"), 10),
                        degrees: degrees,
                        backDegrees: methods.normalize.apply(null, [degrees - 180]),
                        childNumber: i,
                        currentScale: 1,
                        parent: self
                    }
                );
            });

            methods.updateChildren.apply(self);

            // start autoplay if necessary
            if (data.autoplay) {
                data.autoplayStartTimeout = setTimeout(function() {
                    methods.startAutoplay.apply(self);
                }, data.autoplayInitialDelay);
            }

            self.trigger('ready');
            callback.apply(self);
            return self;
        },



        // positioning
        // -----------------------------------------------------------------------

        // updateChildren
        // move children elements into their proper locations
        updateChildren: function() {
            return this
                .each(function() {
                    var self = $(this),
                        data = self.data("roundabout"),
                        inFocus = -1,
                        info = {
                            bearing: data.bearing,
                            tilt: data.tilt,
                            stage: {
                                width: Math.floor($(this).width() * 0.9),
                                height: Math.floor($(this).height() * 0.9)
                            },
                            animating: data.animating,
                            inFocus: data.childInFocus,
                            focusBearingRadian: methods.degToRad.apply(null, [data.focusBearing]),
                            shape: $.roundaboutShapes[data.shape] || $.roundaboutShapes[$.roundaboutShapes.def]
                        };

                    // calculations
                    info.midStage = {
                        width: info.stage.width / 2,
                        height: info.stage.height / 2
                    };

                    info.nudge = {
                        width: info.midStage.width + (info.stage.width * 0.05),
                        height: info.midStage.height + (info.stage.height * 0.05)
                    };

                    info.zValues = {
                        min: data.minZ,
                        max: data.maxZ,
                        diff: data.maxZ - data.minZ
                    };

                    info.opacity = {
                        min: data.minOpacity,
                        max: data.maxOpacity,
                        diff: data.maxOpacity - data.minOpacity
                    };

                    info.scale = {
                        min: data.minScale,
                        max: data.maxScale,
                        diff: data.maxScale - data.minScale
                    };

                    // update child positions
                    self.children(data.childSelector)
                        .each(function(i) {
                            if (methods.updateChild.apply(self, [$(this), info, i, function() { $(this).trigger('ready'); }]) && (!info.animating || data.lastAnimationStep)) {
                                inFocus = i;
                                $(this).addClass("roundabout-in-focus");
                            } else {
                                $(this).removeClass("roundabout-in-focus");
                            }
                        });

                    if (inFocus !== info.inFocus) {
                        // blur old child
                        if (data.triggerBlurEvents) {
                            self.children(data.childSelector)
                                .eq(info.inFocus)
                                .trigger("blur");
                        }

                        data.childInFocus = inFocus;

                        if (data.triggerFocusEvents && inFocus !== -1) {
                            // focus new child
                            self.children(data.childSelector)
                                .eq(inFocus)
                                .trigger("focus");
                        }
                    }

                    self.trigger("childrenUpdated");
                });
        },


        // updateChild
        // repositions a child element into its new position
        updateChild: function(childElement, info, childPos, callback) {
            var factors,
                self = this,
                child = $(childElement),
                data = child.data("roundabout"),
                out = [],
                rad = methods.degToRad.apply(null, [(360.0 - data.degrees) + info.bearing]);

            callback = callback || function() {};

            // adjust radians to be between 0 and Math.PI * 2
            rad = methods.normalizeRad.apply(null, [rad]);

            // get factors from shape
            factors = info.shape(rad, info.focusBearingRadian, info.tilt);

            // correct
            factors.scale = (factors.scale > 1) ? 1 : factors.scale;
            factors.adjustedScale = (info.scale.min + (info.scale.diff * factors.scale)).toFixed(4);
            factors.width = (factors.adjustedScale * data.startWidth).toFixed(4);
            factors.height = (factors.adjustedScale * data.startHeight).toFixed(4);

            // update item
            child
                .css({
                    left: ((factors.x * info.midStage.width + info.nudge.width) - factors.width / 2.0).toFixed(0) + "px",
                    top: ((factors.y * info.midStage.height + info.nudge.height) - factors.height / 2.0).toFixed(0) + "px",
                    width: factors.width + "px",
                    height: factors.height + "px",
                    opacity: (info.opacity.min + (info.opacity.diff * factors.scale)).toFixed(2),
                    zIndex: Math.round(info.zValues.min + (info.zValues.diff * factors.z)),
                    fontSize: (factors.adjustedScale * data.startFontSize).toFixed(1) + "px"
                });
            data.currentScale = factors.adjustedScale;

            // for debugging purposes
            if (self.data("roundabout").debug) {
                out.push("<div style=\"font-weight: normal; font-size: 10px; padding: 2px; width: " + child.css("width") + "; background-color: #ffc;\">");
                out.push("<strong style=\"font-size: 12px; white-space: nowrap;\">Child " + childPos + "</strong><br />");
                out.push("<strong>left:</strong> " + child.css("left") + "<br />");
                out.push("<strong>top:</strong> " + child.css("top") + "<br />");
                out.push("<strong>width:</strong> " + child.css("width") + "<br />");
                out.push("<strong>opacity:</strong> " + child.css("opacity") + "<br />");
                out.push("<strong>height:</strong> " + child.css("height") + "<br />");
                out.push("<strong>z-index:</strong> " + child.css("z-index") + "<br />");
                out.push("<strong>font-size:</strong> " + child.css("font-size") + "<br />");
                out.push("<strong>scale:</strong> " + child.data("roundabout").currentScale);
                out.push("</div>");

                child.html(out.join(""));
            }

            // trigger event
            child.trigger("reposition");

            // callback
            callback.apply(self);

            return methods.isInFocus.apply(self, [data.degrees]);
        },



        // manipulation
        // -----------------------------------------------------------------------

        // setBearing
        // changes the bearing of the roundabout
        setBearing: function(bearing, callback) {
            callback = callback || function() {};
            bearing = methods.normalize.apply(null, [bearing]);

            this
                .each(function() {
                    var diff, lowerValue, higherValue,
                        self = $(this),
                        data = self.data("roundabout"),
                        oldBearing = data.bearing;

                    // set bearing
                    data.bearing = bearing;
                    self.trigger("bearingSet");
                    methods.updateChildren.apply(self);

                    // not animating? we're done here
                    diff = Math.abs(oldBearing - bearing);
                    if (!data.animating || diff > 180) {
                        return;
                    }

                    // check to see if any of the children went through the back
                    diff = Math.abs(oldBearing - bearing);
                    self.children(data.childSelector).each(function(i) {
                        var eventType;

                        if (methods.isChildBackDegreesBetween.apply($(this), [bearing, oldBearing])) {
                            eventType = (oldBearing > bearing) ? "Clockwise" : "Counterclockwise";
                            $(this).trigger("move" + eventType + "ThroughBack");
                        }
                    });
                });

            // call callback if one was given
            callback.apply(this);
            return this;
        },


        // adjustBearing
        // change the bearing of the roundabout by a given degree
        adjustBearing: function(delta, callback) {
            callback = callback || function() {};
            if (delta === 0) {
                return this;
            }

            this
                .each(function() {
                    methods.setBearing.apply($(this), [$(this).data("roundabout").bearing + delta]);
                });

            callback.apply(this);
            return this;
        },


        // setTilt
        // changes the tilt of the roundabout
        setTilt: function(tilt, callback) {
            callback = callback || function() {};

            this
                .each(function() {
                    $(this).data("roundabout").tilt = tilt;
                    methods.updateChildren.apply($(this));
                });

            // call callback if one was given
            callback.apply(this);
            return this;
        },


        // adjustTilt
        // changes the tilt of the roundabout
        adjustTilt: function(delta, callback) {
            callback = callback || function() {};

            this
                .each(function() {
                    methods.setTilt.apply($(this), [$(this).data("roundabout").tilt + delta]);
                });

            callback.apply(this);
            return this;
        },



        // animation
        // -----------------------------------------------------------------------

        // animateToBearing
        // animates the roundabout to a given bearing, all animations come through here
        animateToBearing: function(bearing, duration, easing, passedData, callback) {
            var now = (new Date()).getTime();

            callback = callback || function() {};

            // find callback function in arguments
            if ($.isFunction(passedData)) {
                callback = passedData;
                passedData = null;
            } else if ($.isFunction(easing)) {
                callback = easing;
                easing = null;
            } else if ($.isFunction(duration)) {
                callback = duration;
                duration = null;
            }

            this
                .each(function() {
                    var timer, easingFn, newBearing,
                        self = $(this),
                        data = self.data("roundabout"),
                        thisDuration = (!duration) ? data.duration : duration,
                        thisEasingType = (easing) ? easing : data.easing || "swing";

                    // is this your first time?
                    if (!passedData) {
                        passedData = {
                            timerStart: now,
                            start: data.bearing,
                            totalTime: thisDuration
                        };
                    }

                    // update the timer
                    timer = now - passedData.timerStart;

                    if (data.stopAnimation) {
                        methods.allowAnimation.apply(self);
                        data.animating = false;
                        return;
                    }

                    // we need to animate more
                    if (timer < thisDuration) {
                        if (!data.animating) {
                            self.trigger("animationStart");
                        }

                        data.animating = true;

                        if (typeof $.easing.def === "string") {
                            easingFn = $.easing[thisEasingType] || $.easing[$.easing.def];
                            newBearing = easingFn(null, timer, passedData.start, bearing - passedData.start, passedData.totalTime);
                        } else {
                            newBearing = $.easing[thisEasingType]((timer / passedData.totalTime), timer, passedData.start, bearing - passedData.start, passedData.totalTime);
                        }

                        // fixes issue #24, animation changed as of jQuery 1.7.2
                        // also addresses issue #29, using easing breaks "linear"
                        if (true) {
                            newBearing = passedData.start + ((bearing - passedData.start) * newBearing);
                        }


                        newBearing = methods.normalize.apply(null, [newBearing]);
                        data.dragBearing = newBearing;

                        methods.setBearing.apply(self, [newBearing, function() {
                            setTimeout(function() {  // done with a timeout so that each step is displayed
                                methods.animateToBearing.apply(self, [bearing, thisDuration, thisEasingType, passedData, callback]);
                            }, 0);
                        }]);

                        // we're done animating
                    } else {
                        data.lastAnimationStep = true;

                        bearing = methods.normalize.apply(null, [bearing]);
                        methods.setBearing.apply(self, [bearing, function() {
                            self.trigger("animationEnd");
                        }]);
                        data.animating = false;
                        data.lastAnimationStep = false;
                        data.dragBearing = bearing;

                        callback.apply(self);
                    }
                });

            return this;
        },


        // animateToNearbyChild
        // animates roundabout to a nearby child
        animateToNearbyChild: function(passedArgs, which) {
            var duration = passedArgs[0],
                easing = passedArgs[1],
                callback = passedArgs[2] || function() {};

            // find callback
            if ($.isFunction(easing)) {
                callback = easing;
                easing = null;
            } else if ($.isFunction(duration)) {
                callback = duration;
                duration = null;
            }

            return this
                .each(function() {
                    var j, range,
                        self = $(this),
                        data = self.data("roundabout"),
                        bearing = (!data.reflect) ? data.bearing % 360 : data.bearing,
                        length = self.children(data.childSelector).length;

                    if (!data.animating) {
                        // reflecting, not moving to previous || not reflecting, moving to next
                        if ((data.reflect && which === "previous") || (!data.reflect && which === "next")) {
                            // slightly adjust for rounding issues
                            bearing = (Math.abs(bearing) < data.floatComparisonThreshold) ? 360 : bearing;

                            // clockwise
                            for (j = 0; j < length; j += 1) {
                                range = {
                                    lower: (data.period * j),
                                    upper: (data.period * (j + 1))
                                };
                                range.upper = (j === length - 1) ? 360 : range.upper;

                                if (bearing <= Math.ceil(range.upper) && bearing >= Math.floor(range.lower)) {
                                    if (length === 2 && bearing === 360) {
                                        methods.animateToDelta.apply(self, [-180, duration, easing, callback]);
                                    } else {
                                        methods.animateBearingToFocus.apply(self, [range.lower, duration, easing, callback]);
                                    }
                                    break;
                                }
                            }
                        } else {
                            // slightly adjust for rounding issues
                            bearing = (Math.abs(bearing) < data.floatComparisonThreshold || 360 - Math.abs(bearing) < data.floatComparisonThreshold) ? 0 : bearing;

                            // counterclockwise
                            for (j = length - 1; j >= 0; j -= 1) {
                                range = {
                                    lower: data.period * j,
                                    upper: data.period * (j + 1)
                                };
                                range.upper = (j === length - 1) ? 360 : range.upper;

                                if (bearing >= Math.floor(range.lower) && bearing < Math.ceil(range.upper)) {
                                    if (length === 2 && bearing === 360) {
                                        methods.animateToDelta.apply(self, [180, duration, easing, callback]);
                                    } else {
                                        methods.animateBearingToFocus.apply(self, [range.upper, duration, easing, callback]);
                                    }
                                    break;
                                }
                            }
                        }
                    }
                });
        },


        // animateToNearestChild
        // animates roundabout to the nearest child
        animateToNearestChild: function(duration, easing, callback) {
            callback = callback || function() {};

            // find callback
            if ($.isFunction(easing)) {
                callback = easing;
                easing = null;
            } else if ($.isFunction(duration)) {
                callback = duration;
                duration = null;
            }

            return this
                .each(function() {
                    var nearest = methods.getNearestChild.apply($(this));
                    methods.animateToChild.apply($(this), [nearest, duration, easing, callback]);
                });
        },


        // animateToChild
        // animates roundabout to a given child position
        animateToChild: function(childPosition, duration, easing, callback) {
            callback = callback || function() {};

            // find callback
            if ($.isFunction(easing)) {
                callback = easing;
                easing = null;
            } else if ($.isFunction(duration)) {
                callback = duration;
                duration = null;
            }

            return this
                .each(function() {
                    var child,
                        self = $(this),
                        data = self.data("roundabout");

                    if (data.childInFocus !== childPosition && !data.animating) {
                        child = self.children(data.childSelector).eq(childPosition);
                        methods.animateBearingToFocus.apply(self, [child.data("roundabout").degrees, duration, easing, callback]);
                    }
                });
        },


        // animateToNextChild
        // animates roundabout to the next child
        animateToNextChild: function(duration, easing, callback) {
            return methods.animateToNearbyChild.apply(this, [arguments, "next"]);
        },


        // animateToPreviousChild
        // animates roundabout to the preious child
        animateToPreviousChild: function(duration, easing, callback) {
            return methods.animateToNearbyChild.apply(this, [arguments, "previous"]);
        },


        // animateToDelta
        // animates roundabout to a given delta (in degrees)
        animateToDelta: function(degrees, duration, easing, callback) {
            callback = callback || function() {};

            // find callback
            if ($.isFunction(easing)) {
                callback = easing;
                easing = null;
            } else if ($.isFunction(duration)) {
                callback = duration;
                duration = null;
            }

            return this
                .each(function() {
                    var delta = $(this).data("roundabout").bearing + degrees;
                    methods.animateToBearing.apply($(this), [delta, duration, easing, callback]);
                });
        },


        // animateBearingToFocus
        // animates roundabout to bring a given angle into focus
        animateBearingToFocus: function(degrees, duration, easing, callback) {
            callback = callback || function() {};

            // find callback
            if ($.isFunction(easing)) {
                callback = easing;
                easing = null;
            } else if ($.isFunction(duration)) {
                callback = duration;
                duration = null;
            }

            return this
                .each(function() {
                    var delta = $(this).data("roundabout").bearing - degrees;
                    delta = (Math.abs(360 - delta) < Math.abs(delta)) ? 360 - delta : -delta;
                    delta = (delta > 180) ? -(360 - delta) : delta;

                    if (delta !== 0) {
                        methods.animateToDelta.apply($(this), [delta, duration, easing, callback]);
                    }
                });
        },


        // stopAnimation
        // if an animation is currently in progress, stop it
        stopAnimation: function() {
            return this
                .each(function() {
                    $(this).data("roundabout").stopAnimation = true;
                });
        },


        // allowAnimation
        // clears the stop-animation hold placed by stopAnimation
        allowAnimation: function() {
            return this
                .each(function() {
                    $(this).data("roundabout").stopAnimation = false;
                });
        },



        // autoplay
        // -----------------------------------------------------------------------

        // startAutoplay
        // starts autoplaying this roundabout
        startAutoplay: function(callback) {
            return this
                .each(function() {
                    var self = $(this),
                        data = self.data("roundabout");

                    callback = callback || data.autoplayCallback || function() {};

                    clearInterval(data.autoplayInterval);
                    data.autoplayInterval = setInterval(function() {
                        methods.animateToNextChild.apply(self, [callback]);
                    }, data.autoplayDuration);
                    data.autoplayIsRunning = true;

                    self.trigger("autoplayStart");
                });
        },


        // stopAutoplay
        // stops autoplaying this roundabout
        stopAutoplay: function(keepAutoplayBindings) {
            return this
                .each(function() {
                    clearInterval($(this).data("roundabout").autoplayInterval);
                    $(this).data("roundabout").autoplayInterval = null;
                    $(this).data("roundabout").autoplayIsRunning = false;

                    // this will prevent autoplayPauseOnHover from restarting autoplay
                    if (!keepAutoplayBindings) {
                        $(this).unbind(".autoplay");
                    }

                    $(this).trigger("autoplayStop");
                });
        },


        // toggleAutoplay
        // toggles autoplay pause/resume
        toggleAutoplay: function(callback) {
            return this
                .each(function() {
                    var self = $(this),
                        data = self.data("roundabout");

                    callback = callback || data.autoplayCallback || function() {};

                    if (!methods.isAutoplaying.apply($(this))) {
                        methods.startAutoplay.apply($(this), [callback]);
                    } else {
                        methods.stopAutoplay.apply($(this), [callback]);
                    }
                });
        },


        // isAutoplaying
        // is this roundabout currently autoplaying?
        isAutoplaying: function() {
            return (this.data("roundabout").autoplayIsRunning);
        },


        // changeAutoplayDuration
        // stops the autoplay, changes the duration, restarts autoplay
        changeAutoplayDuration: function(duration) {
            return this
                .each(function() {
                    var self = $(this),
                        data = self.data("roundabout");

                    data.autoplayDuration = duration;

                    if (methods.isAutoplaying.apply(self)) {
                        methods.stopAutoplay.apply(self);
                        setTimeout(function() {
                            methods.startAutoplay.apply(self);
                        }, 10);
                    }
                });
        },



        // helpers
        // -----------------------------------------------------------------------

        // normalize
        // regulates degrees to be >= 0.0 and < 360
        normalize: function(degrees) {
            var inRange = degrees % 360.0;
            return (inRange < 0) ? 360 + inRange : inRange;
        },


        // normalizeRad
        // regulates radians to be >= 0 and < Math.PI * 2
        normalizeRad: function(radians) {
            while (radians < 0) {
                radians += (Math.PI * 2);
            }

            while (radians > (Math.PI * 2)) {
                radians -= (Math.PI * 2);
            }

            return radians;
        },


        // isChildBackDegreesBetween
        // checks that a given child's backDegrees is between two values
        isChildBackDegreesBetween: function(value1, value2) {
            var backDegrees = $(this).data("roundabout").backDegrees;

            if (value1 > value2) {
                return (backDegrees >= value2 && backDegrees < value1);
            } else {
                return (backDegrees < value2 && backDegrees >= value1);
            }
        },


        // getAnimateToMethod
        // takes a user-entered option and maps it to an animation method
        getAnimateToMethod: function(effect) {
            effect = effect.toLowerCase();

            if (effect === "next") {
                return "animateToNextChild";
            } else if (effect === "previous") {
                return "animateToPreviousChild";
            }

            // default selection
            return "animateToNearestChild";
        },


        // relayoutChildren
        // lays out children again with new contextual information
        relayoutChildren: function() {
            return this
                .each(function() {
                    var self = $(this),
                        settings = $.extend({}, self.data("roundabout"));

                    settings.startingChild = self.data("roundabout").childInFocus;
                    methods.init.apply(self, [settings, null, true]);
                });
        },


        // getNearestChild
        // gets the nearest child from the current bearing
        getNearestChild: function() {
            var self = $(this),
                data = self.data("roundabout"),
                length = self.children(data.childSelector).length;

            if (!data.reflect) {
                return ((length) - (Math.round(data.bearing / data.period) % length)) % length;
            } else {
                return (Math.round(data.bearing / data.period) % length);
            }
        },


        // degToRad
        // converts degrees to radians
        degToRad: function(degrees) {
            return methods.normalize.apply(null, [degrees]) * Math.PI / 180.0;
        },


        // getPlacement
        // returns the starting degree for a given child
        getPlacement: function(child) {
            var data = this.data("roundabout");
            return (!data.reflect) ? 360.0 - (data.period * child) : data.period * child;
        },


        // isInFocus
        // is this roundabout currently in focus?
        isInFocus: function(degrees) {
            var diff,
                self = this,
                data = self.data("roundabout"),
                bearing = methods.normalize.apply(null, [data.bearing]);

            degrees = methods.normalize.apply(null, [degrees]);
            diff = Math.abs(bearing - degrees);

            // this calculation gives a bit of room for javascript float rounding
            // errors, it looks on both 0deg and 360deg ends of the spectrum
            return (diff <= data.floatComparisonThreshold || diff >= 360 - data.floatComparisonThreshold);
        },


        // getChildInFocus
        // returns the current child in focus, or false if none are in focus
        getChildInFocus: function() {
            var data = $(this).data("roundabout");

            return (data.childInFocus > -1) ? data.childInFocus : false;
        },


        // compareVersions
        // compares a given version string with another
        compareVersions: function(baseVersion, compareVersion) {
            var i,
                base = baseVersion.split(/\./i),
                compare = compareVersion.split(/\./i),
                maxVersionSegmentLength = (base.length > compare.length) ? base.length : compare.length;

            for (i = 0; i <= maxVersionSegmentLength; i++) {
                if (base[i] && !compare[i] && parseInt(base[i], 10) !== 0) {
                    // base is higher
                    return 1;
                } else if (compare[i] && !base[i] && parseInt(compare[i], 10) !== 0) {
                    // compare is higher
                    return -1;
                } else if (base[i] === compare[i]) {
                    // these are the same, next
                    continue;
                }

                if (base[i] && compare[i]) {
                    if (parseInt(base[i], 10) > parseInt(compare[i], 10)) {
                        // base is higher
                        return 1;
                    } else {
                        // compare is higher
                        return -1;
                    }
                }
            }

            // nothing was triggered, versions are the same
            return 0;
        }
    };


    // start the plugin
    $.fn.roundabout = function(method) {
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === "object" || $.isFunction(method) || !method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error("Method " + method + " does not exist for jQuery.roundabout.");
        }
    };
})(jQuery);;
/**
 * Copyright (c) 2007-2013 Ariel Flesler - aflesler<a>gmail<d>com | http://flesler.blogspot.com
 * Dual licensed under MIT and GPL.
 * @author Ariel Flesler
 * @version 1.4.6
 */
;(function($){var h=$.scrollTo=function(a,b,c){$(window).scrollTo(a,b,c)};h.defaults={axis:'xy',duration:parseFloat($.fn.jquery)>=1.3?0:1,limit:true};h.window=function(a){return $(window)._scrollable()};$.fn._scrollable=function(){return this.map(function(){var a=this,isWin=!a.nodeName||$.inArray(a.nodeName.toLowerCase(),['iframe','#document','html','body'])!=-1;if(!isWin)return a;var b=(a.contentWindow||a).document||a.ownerDocument||a;return/webkit/i.test(navigator.userAgent)||b.compatMode=='BackCompat'?b.body:b.documentElement})};$.fn.scrollTo=function(e,f,g){if(typeof f=='object'){g=f;f=0}if(typeof g=='function')g={onAfter:g};if(e=='max')e=9e9;g=$.extend({},h.defaults,g);f=f||g.duration;g.queue=g.queue&&g.axis.length>1;if(g.queue)f/=2;g.offset=both(g.offset);g.over=both(g.over);return this._scrollable().each(function(){if(e==null)return;var d=this,$elem=$(d),targ=e,toff,attr={},win=$elem.is('html,body');switch(typeof targ){case'number':case'string':if(/^([+-]=?)?\d+(\.\d+)?(px|%)?$/.test(targ)){targ=both(targ);break}targ=$(targ,this);if(!targ.length)return;case'object':if(targ.is||targ.style)toff=(targ=$(targ)).offset()}$.each(g.axis.split(''),function(i,a){var b=a=='x'?'Left':'Top',pos=b.toLowerCase(),key='scroll'+b,old=d[key],max=h.max(d,a);if(toff){attr[key]=toff[pos]+(win?0:old-$elem.offset()[pos]);if(g.margin){attr[key]-=parseInt(targ.css('margin'+b))||0;attr[key]-=parseInt(targ.css('border'+b+'Width'))||0}attr[key]+=g.offset[pos]||0;if(g.over[pos])attr[key]+=targ[a=='x'?'width':'height']()*g.over[pos]}else{var c=targ[pos];attr[key]=c.slice&&c.slice(-1)=='%'?parseFloat(c)/100*max:c}if(g.limit&&/^\d+$/.test(attr[key]))attr[key]=attr[key]<=0?0:Math.min(attr[key],max);if(!i&&g.queue){if(old!=attr[key])animate(g.onAfterFirst);delete attr[key]}});animate(g.onAfter);function animate(a){$elem.animate(attr,f,g.easing,a&&function(){a.call(this,targ,g)})}}).end()};h.max=function(a,b){var c=b=='x'?'Width':'Height',scroll='scroll'+c;if(!$(a).is('html,body'))return a[scroll]-$(a)[c.toLowerCase()]();var d='client'+c,html=a.ownerDocument.documentElement,body=a.ownerDocument.body;return Math.max(html[scroll],body[scroll])-Math.min(html[d],body[d])};function both(a){return typeof a=='object'?a:{top:a,left:a}}})(jQuery);
;
/*
 * jQuery WidowFix Plugin
 * http://matthewlein.com/widowfix/
 * Copyright (c) 2010 Matthew Lein
 * Version: 1.3.2 (7/23/2011)
 * Dual licensed under the MIT and GPL licenses
 * Requires: jQuery v1.4 or later
 */

(function(a){jQuery.fn.widowFix=function(d){var c={letterLimit:null,prevLimit:null,linkFix:false,dashes:false};var b=a.extend(c,d);if(this.length){return this.each(function(){var i=a(this);var n;if(b.linkFix){var h=i.find("a:last");h.wrap("<var>");var e=a("var").html();n=h.contents()[0];h.contents().unwrap()}var f=a(this).html().split(" "),m=f.pop();if(f.length<=1){return}function k(){if(m===""){m=f.pop();k()}}k();if(b.dashes){var j=["-","¨C","¡ª"];a.each(j,function(o,p){if(m.indexOf(p)>0){m='<span style="white-space:nowrap;">'+m+"</span>";return false}})}var l=f[f.length-1];if(b.linkFix){if(b.letterLimit!==null&&n.length>=b.letterLimit){i.find("var").each(function(){a(this).contents().replaceWith(e);a(this).contents().unwrap()});return}else{if(b.prevLimit!==null&&l.length>=b.prevLimit){i.find("var").each(function(){a(this).contents().replaceWith(e);a(this).contents().unwrap()});return}}}else{if(b.letterLimit!==null&&m.length>=b.letterLimit){return}else{if(b.prevLimit!==null&&l.length>=b.prevLimit){return}}}var g=f.join(" ")+"&nbsp;"+m;i.html(g);if(b.linkFix){i.find("var").each(function(){a(this).contents().replaceWith(e);a(this).contents().unwrap()})}})}}})(jQuery);;
(function ( $ ) {
$.fn.isOnScreen = function(){
    
    var win = $(window);
    
    var viewport = {
        top : win.scrollTop(),
        left : win.scrollLeft()
    };
    viewport.right = viewport.left + win.width();
    viewport.bottom = viewport.top + win.height();
    
    var bounds = this.offset();
    bounds.right = bounds.left + this.outerWidth();
    bounds.bottom = bounds.top + this.outerHeight();
    
    return (!(viewport.right < bounds.left || viewport.left > bounds.right || viewport.bottom < bounds.top || viewport.top > bounds.bottom));
    
}
}( jQuery ));;
(function($){

    var selfflag = true;

    $(window).scroll(function() {
        /*----------------Mobile image animate-------------*/

        var elem = $('.lr-get-started ul li').first(), selfelem = $('.testimonial-inner-wrap');

        if(elem.isOnScreen()){
            $('.img-animate').animate({
                top: '0px'
            }, 800, 'easeOutBack').css('visibility','visible') ;
        }

        if($('.field-name-field-testimonial-source').isOnScreen(true)) {
            /*---Heart Animation---*/
            if(selfflag){
                $('.field-name-field-customer-logo img').attr("src", "/sites/all/themes/zen_pronq_mktg/images/loadrunner/hand-animate.gif");
                selfflag = false;
            }
        }
    });

})(jQuery);;
/*!
 * classie - class helper functions
 * from bonzo https://github.com/ded/bonzo
 * 
 * classie.has( elem, 'my-class' ) -> true/false
 * classie.add( elem, 'my-new-class' )
 * classie.remove( elem, 'my-unwanted-class' )
 * classie.toggle( elem, 'my-class' )
 */

/*jshint browser: true, strict: true, undef: true */
/*global define: false */

( function( window ) {

'use strict';

// class helper functions from bonzo https://github.com/ded/bonzo

function classReg( className ) {
  return new RegExp("(^|\\s+)" + className + "(\\s+|$)");
}

// classList support for class management
// altho to be fair, the api sucks because it won't accept multiple classes at once
var hasClass, addClass, removeClass;

if ( 'classList' in document.documentElement ) {
  hasClass = function( elem, c ) {
    return elem.classList.contains( c );
  };
  addClass = function( elem, c ) {
    // elem.classList.add( c );
  };
  removeClass = function( elem, c ) {
    elem.classList.remove( c );
  };
}
else {
  hasClass = function( elem, c ) {
    return classReg( c ).test( elem.className );
  };
  addClass = function( elem, c ) {
    if ( !hasClass( elem, c ) ) {
      elem.className = elem.className + ' ' + c;
    }
  };
  removeClass = function( elem, c ) {
    elem.className = elem.className.replace( classReg( c ), ' ' );
  };
}

function toggleClass( elem, c ) {
  var fn = hasClass( elem, c ) ? removeClass : addClass;
  fn( elem, c );
}

var classie = {
  // full names
  hasClass: hasClass,
  addClass: addClass,
  removeClass: removeClass,
  toggleClass: toggleClass,
  // short names
  has: hasClass,
  add: addClass,
  remove: removeClass,
  toggle: toggleClass
};

// transport
if ( typeof define === 'function' && define.amd ) {
  // AMD
  define( classie );
} else {
  // browser global
  window.classie = classie;
}

})( window );
;
(function ($) {

    var index = 0;
    var arr_length = $('.group-featurettes .node-featurette').length;
    var fadeInProgress = false;
    var distance = arr_length ? $('#group-featurettes').offset().top - 1000 : 0;
    var downFlag = true;
    var start_magnifier_animation = true;
    var slider_index = 0

    Drupal.behaviors.pdp = {
        attach: function (context, settings) {
            /* Put a wrapper around banner/footer CTAs and supporting text */
            Drupal.behaviors.pdp.wrapCTAs();
            
            /* Add waypoint for carousel */
            Drupal.behaviors.pdp.pronqWaypoint();

            /* Add overview arrow section */
            Drupal.behaviors.pdp.overviewArrow();

            /* Add how it works arrow */
            Drupal.behaviors.pdp.howItWorksArrow();

            /* Video */
            Drupal.behaviors.pdp.videoOverlay();
            Drupal.behaviors.pdp.videoOverlayListeners();
            
            /* Fall back to the full title if the shortened title isnt available */
            Drupal.behaviors.pdp.title_fallback()
            
            /* If a video screenshot is available, apply it to the video region*/
            Drupal.behaviors.pdp.handleVideoScreenshot();
            
            /* If this PDP has a background image specified, apply it to the region around the video */
            Drupal.behaviors.pdp.handleVideoBackground();
            
            /* Activate tabs */
            Drupal.behaviors.pdp.handlePDPTabs();
            
            $('.magnifier').css('left','-39%');

            $(window).scroll(function() {
                /* Trigger Nav bar on page load */
                Drupal.behaviors.pdp.staticNavigationBar();

                /* Trigger features fade in */
                if ($(this).scrollTop() >= distance ) {
                    if(!fadeInProgress) {
                        Drupal.behaviors.pdp.fadeInSeq();
                    }
                }
                Drupal.behaviors.pdp.magnifier(slider_index);

            });

            $(window).resize(function() {
                var currentSlide = slider_index;
                $('.roundabout-in-focus .magnifier-zoomed').tooltip('hide');
                $('.roundabout-in-focus .magnifier-zoomed').data('tooltip',false);

                $('.roundabout-holder li').removeAttr('style');
                
                Drupal.behaviors.pdp.handleWidth()
                
                $('.roundabout-holder').roundabout({
                    responsive: false,
                    triggerFocusEvents: true,
                    minScale: 0.7,
                    startingChild: currentSlide
                });
                $('.roundabout-in-focus .magnifier-zoomed').tooltip({
                    trigger:'manual'
                });
                Drupal.behaviors.pdp.magnifier(currentSlide);
                Drupal.behaviors.pdp.videoOverlay();
            });
            $(window).trigger("resize")
            /* Tool Tip */
            $('.icon-info').tooltip({
                trigger: 'hover'
            });

            $('.magnifier-zoomed').tooltip({
                trigger:'manual'
            });

            $('#pdp-testimonials-carousel').carousel({
                pause: true,
                interval: false
            });

            $("#pdp-testimonials-carousel").swiperight(function() {
                $(this).carousel('prev');
            });
            $("#pdp-testimonials-carousel").swipeleft(function() {
                $(this).carousel('next');
            });

            if(!Drupal.behaviors.pdp.isAppleDevice()){

                $('.pronq-analysis-coverflow h2').css('margin-top','0px');
                $('.carousel-indicator-anchor li').on('click',function(){
                    if(downFlag){
                        downFlag = false;
                        var target = $(this).data('target');
                        var clickedId = $(this).attr("id")
                        //offset_val = $(this).data('offset');
                        offset_val = -64;

                        if (target == '#group-screenshots') {
                            offset_val = -184;
                        }
                        if($(window).width() <= '1024'){
                            var offsetSmall = $(this).data('offset-small');
                            offset_val = (offsetSmall !== undefined)?offsetSmall:offset_val;
                        }
                        $.scrollTo($(target),800,{offset:offset_val,onAfter:function(){
                            var id = (target == '.pronq-analysis-coverflow')?'details':$(target).attr('id');
                            $('.carousel-indicator-anchor li').removeClass('active');
                            $('.carousel-indicator-anchor li#'+clickedId).addClass('active');
                            downFlag = true;
                        }});
                    }
                    $('.carousel-indicators li').removeClass('active');
                });

                $('.carousel-indicator-anchor li').on('mouseenter',function(){
                    $('.carousel-indicator-anchor').addClass('hovered');
                    $('.carousel-indicator-anchor li').addClass('default');
                    $(this).removeClass('default').addClass('current-indicator');
                }).on('mouseleave',function(){
                    $('.carousel-indicator-anchor').removeClass('hovered');
                    $('.carousel-indicator-anchor li').removeClass('default');
                    $(this).removeClass('current-indicator');
                });
            }
            if($("body").hasClass("node-type-solution-fod")) {
                Drupal.behaviors.pdp.attachFodModal();
            }
            $(window).on('hashchange', Drupal.behaviors.pdp.hashChange)
            $(window).trigger('hashchange');
        },

        hashChange: function() {
            if(!(window.location.hash)) return;
            if(window.location.hash=="#video" && $("#group-video-module").length >0) {
                // Autoplay hash for video (#video)
                $('.video-content').fadeIn(0);
                $('.video-content iframe').on('load', function(){
                    Drupal.behaviors.pdp.toggleVideo('show');
                    setTimeout(function(){
                        Drupal.behaviors.pdp.messageVideoFrame("playVideo");
                    }, 1000);
                })
                Drupal.behaviors.pdp.toggleVideo('show');
                Drupal.behaviors.pdp.messageVideoFrame("playVideo");
            }
        },
        handleWidth: function() {
            roundabout = $(".pdp-analysis-coverflow ul#details");
            width = $(window).width() * 0.9
            if(width<882) {
                roundabout.find("li").each(function(){
                    $(this).css({width: width, height:width*.6})
                })
                roundabout.css({height:width*.6})
            } else {
                roundabout.find("li").each(function(){
                    $(this).css({width: null,height: null})
                })
                roundabout.css({height:null})
            }
        },
        overviewArrow: function() {
            $("#group-banner").next().prepend('<div id="overview-arrow" class="down-arrow"> </div>');
            $(".group_overview .down-arrow").click(function() {
                $('html, body').animate({
                    scrollTop: $("#group-overview").offset().top - 65
                }, 1000);
            });
        },
        howItWorksArrow: function() {
            if($( ".field-name-field-how-it-works-text" ).length==0) {
                $(".field-name-field-how-it-works").after('<br style="clear:both"/><div id="bottom-arrow" class="down-arrow"> </div>');
            } else {
                $( ".field-name-field-how-it-works-text" ).after('<div id="bottom-arrow" class="down-arrow"> </div>');
            }
            $(".group_how_it_works .down-arrow").click(function() {
                $('html, body').animate({
                    scrollTop: $("#group-getting-started").offset().top - 65
                }, 1000);
            });
        },

        staticNavigationBar: function() {
           var overviewOffset = $('#pronq-global-menu').offset().top;
           var navBarAnimate = $('.navbar-animate');
           if (pageYOffset > overviewOffset) {
             if (!navBarAnimate.hasClass('navbar-view')) {
                 navBarAnimate.addClass('navbar-view');
             }
           }else{
             if (navBarAnimate.hasClass('navbar-view')) {
                 navBarAnimate.removeClass('navbar-view');
             }
           }
        },

        videoOverlay: function() {
            var maxWidth = 640;
            var maxHeight = 495;

            // Size video according to window size
            width = 640;
            height = 400; //380
            availableWidth = $(window).width();
            availableHeight = $(window).height();
            padding = Math.floor(Math.min(availableWidth, availableHeight)*.1)

            proposedWidth = availableWidth - padding;
            if(proposedWidth>maxWidth) proposedWidth=maxWidth;
            proposedHeight = Math.floor(proposedWidth * height / width);

            if(proposedHeight > availableHeight - padding) {
                proposedHeight = availableHeight - padding;
                if(proposedHeight>maxHeight) proposedHeight = maxHeight;
                proposedWidth = Math.floor(proposedHeight * width / height);
            }

            $('.video-body').css({
                width:proposedWidth,
                height:proposedHeight,
                marginLeft:Math.floor(-1*proposedWidth/2),
                marginTop:Math.floor(-1*proposedHeight/2)
            });
            $('.video-body iframe').css({
                width:proposedWidth-10,
                height:proposedHeight-10
            });
        },

        videoOverlayListeners: function() {
            $('.play').on('click',function(e){
                e.preventDefault();
                $('.video-content').fadeIn();
                setTimeout(function(){Drupal.behaviors.pdp.toggleVideo('show');}, 750)
                return false;
            });

            $('.close-video').on('click',function(){
                $('.video-content').fadeOut();
                Drupal.behaviors.pdp.toggleVideo('hide');
                if(window.location.hash=="#video") {
                    setTimeout(function() {
                        history.pushState(null, null, '#');
                        $(window).trigger('hashchange');
                    }, 750);
                }
                return false;
            });
            $('.video-content').on('click',function(){
                $('.video-content').fadeOut();
                Drupal.behaviors.pdp.toggleVideo('hide');
                if(window.location.hash=="#video") {
                    setTimeout(function() {
                        history.pushState(null, null, '#');
                        $(window).trigger('hashchange');
                    }, 750);
                }
                return false;
            });
        },

        toggleVideo: function(state) {
            func = state == 'hide' ? 'pauseVideo' : 'playVideo';
            Drupal.behaviors.pdp.messageVideoFrame(func)
            if(state=='hide') 
                setTimeout(function(){
                    // Rewind the video
                    Drupal.behaviors.pdp.messageVideoFrame("seekTo", "0");
                }, 750)
        },
        messageVideoFrame:function(func, args) {
            if(func==null) return;
            if(args==null) args = "\"\""; // blank string by default
            var iframe = document.getElementsByTagName("iframe")[0].contentWindow;
            iframe.postMessage('{"event":"command","func":"' + func + '","args":'+args+'}', '*');
        },
        fadeInSeq: function() {
            var item = $('.field-name-field-featurettes > div > div')[index];
            fadeInProgress = true;
            $(item).css('opacity', 0)
                .animate(
                   { opacity: 1 },
                   { duration: 'slow', complete:function() {
                     index++;
                     index < arr_length ? Drupal.behaviors.pdp.fadeInSeq(): fadeInProgress = false;
                   }
                });

        },

        magnifier: function() {
            if ($('.magnifier').length) {
                var magnifier_top = $('.magnifier').offset().top - 300;
                if(pageYOffset > magnifier_top && start_magnifier_animation){
                    slider_index = 0;
                    start_magnifier_animation = false;
                    var left = '62%';
                    var top = '16%'
                    positions = window.$carousel.data("positions");
                    if(positions!=null && positions[0]!=null) {
                        if(positions[0].stop!=null) {
                            left = positions[0].stop
                        }
                        if(positions[0].top!=null) {
                            top = positions[0].top
                        }
                        
                    }
                    $('.roundabout-in-focus .magnifier .magnifier-empty').show();
                    $('.roundabout-in-focus .magnifier').animate({
                        left: left,
                        top: top
                    }, 1000,function(){
                        var $magnifier = $('.roundabout-in-focus .magnifier-zoomed');
                        $magnifier.fadeIn(500);
                        $magnifier.tooltip('show');
                    });


                }
            }
        },

        pronqWaypoint: function() {
            $('#group-header').waypoint(function(){
                $(".carousel-indicator-anchor li").removeClass('active');
                $(".carousel-indicator-anchor li#link-home").addClass('active');
            },{offset: 0});

            $('#group-overview').waypoint(function(){
                $(".carousel-indicator-anchor li").removeClass('active');
                $(".carousel-indicator-anchor li#link-overview").addClass('active');
                $(".carousel-indicator-anchor").toggle();
            },{offset: 65});

            $('#group-testimonials').waypoint(function(){
                $(".carousel-indicator-anchor li").removeClass('active');
                $(".carousel-indicator-anchor li#link-testimonial").addClass('active');
            },{offset: 100});

            $('#group-video-module').waypoint(function(){
                $(".carousel-indicator-anchor li").removeClass('active');
                $(".carousel-indicator-anchor li#link-video").addClass('active');
            },{offset: 65});

            $('#group-featurettes').waypoint(function(){
                $(".carousel-indicator-anchor li").removeClass('active');
                $(".carousel-indicator-anchor li#link-features").addClass('active');
            },{offset: 65});

            $('#group-screenshots').waypoint(function(){
                $(".carousel-indicator-anchor li").removeClass('active');
                $(".carousel-indicator-anchor li#link-screen-shots").addClass('active');
            },{offset: 160});

            $('#group-how-it-works').waypoint(function(){
                $(".carousel-indicator-anchor li").removeClass('active');
                $(".carousel-indicator-anchor li#link-how-it-works").addClass('active');
            },{offset: 65});

            $('#group-getting-started').waypoint(function(){
                $(".carousel-indicator-anchor li").removeClass('active');
                $(".carousel-indicator-anchor li#link-start-now").addClass('active');
            },{offset: 65});
        },
        scaleBannerGroup: function() {
            if(Drupal.behaviors.pdp.isAppleDevice()) return;
            var bannerMaxHeight = 0
            // Scale the #group-banner 's height to an apropriate height where the field_3_column_title heading is at
            // the bottom of the window, within reason. Each pdp can have a different maximum height for this.
            if($("body").hasClass("node-type-solution-ptas")) {
                // Max height for PDP page
                bannerMaxHeight = 485;
            }

            if(bannerMaxHeight>0) {
                var banner = $("#group-banner");
                // Calculate how much extra height is needed
                var extraHeaderHeight = $(window).height() - Drupal.behaviors.pdp.getOffsetTop($("#overview-arrow").get(0)) - 120;
                var newBannerHeight = banner.height() + extraHeaderHeight;
                // If it's above the max, just use the max
                if(newBannerHeight>bannerMaxHeight) {
                    newBannerHeight = bannerMaxHeight;
                    extraHeaderHeight = newBannerHeight - banner.height();
                }
                if(banner.height()<newBannerHeight) {
                    // Set the height
                    banner.css({height:newBannerHeight});
                    // Add about half to the #group-banners top spacing so it's vertially centered in the colored region
                    paddingTopNew = parseInt($("#group-banner > div").css("padding-top"));
                    paddingTopNew += Math.floor(extraHeaderHeight/2)-30;
                    $("#group-banner > div").css({paddingTop:paddingTopNew});
                }
            }
        },
        getOffsetTop: function( elem ) {
            var offsetTop = 0;
            do {
                if ( !isNaN( elem.offsetTop ) )
                {
                    offsetTop += elem.offsetTop;
                }
            } while( elem = elem.offsetParent );
            return offsetTop;
        },
        isAppleDevice: function() {
            var p = navigator.platform;
            if( p === 'iPad' || p === 'iPhone' || p === 'iPod' || p === 'iPad Simulator' || p === 'iPhone Simulator' ){
                return true;
            }
            return false;
        },

        magnifierReload: function () {
            var $currentContent = $('.roundabout-in-focus .roundabout-subcontent'),
                $currentMagnify = $('.roundabout-in-focus .large');
            $mainContent = $('.roundabout-content');

            $mainContent.find('h2').text($currentContent.find('h2').text());
            $mainContent.find('p').text($currentContent.find('p').text());
            //$mainContent.hide().fadeIn('slow');
            $currentMagnify.css({right: 0, top: '', left: ''}).hide();
            $currentMagnify.show().css({
                right: '35%',
                top: '10%'
            });
        },
        title_fallback: function() {
            if($(".field-name-field-short-title").length==0) {
                $(".field-name-field-logo-title").addClass("no-short-title");
            }
        },
        handleVideoScreenshot: function() {
            // If there's a video screenshot, use the image as a background on the video
            if($(".field-name-field-video-screenshot img").length>0) {
                imgUrl = $(".field-name-field-video-screenshot img").attr("src");
                $("#group-video-module div.video-bg").css({backgroundImage:"url("+imgUrl+")"});
                $("#group-video-module .video-wrapper").addClass("has-background");
            }
        },
        handleVideoBackground: function() {
            img = $(".field-name-field-video-background img")
            if(img.length) {
                $(".field-name-field-video").css({backgroundImage:"url("+img.attr("src")+")"})
            }
        },
        handlePDPTabs:function() {
            $(".pdptabs").each(function() {
                var tabs = $(this).find("ul.tabs-pager");
                var content = $(this).find("div.tabs-content");
                var tabIndex = 0;
                var defaultIndex = null;
                
                tabs.find("a").each(function(){
                    $(this).attr("index", tabIndex).click(function(){
                        var tabContainer = $(this).parent().parent().parent();
                        // Change active tab
                        var tabs = tabContainer.find("div.tabs-content");
                        tabs.find(".tab-content.active").removeClass("active")
                        tabs.find(".tab-content[index="+$(this).attr("index")+"]").addClass("active")
                        
                        // Change active menu link
                        tabContainer.find("ul.tabs-pager li.active").removeClass("active");
                        $(this).parent().addClass("active");
                        
                    })
                    if($(this).hasClass("default")) {
                        defaultIndex = tabIndex;
                        $(this).parent().addClass("active");
                    }
                    $(this).addClass("tabindex-"+tabIndex);
                    tabIndex++;
                })
                
                tabIndex = 0;
                content.find(".tab-content").each(function() {
                    $(this).attr("index", tabIndex);
                    // Hide all tabs except the active tab
                    if((defaultIndex==null && tabIndex==0)  ||  (defaultIndex!=null && tabIndex==defaultIndex)) {
                        // Keep tab
                        $(this).addClass("active");
                    }
                    tabIndex++;
                })
            })
        },
        attachFodModal: function() {
            $(window).on('hashchange', function() {
                if(window.location.hash=="#scan-types") {
                    modalContent = $(".pdp-modal").html()
                    $("#main").append('<div class="pdp-modal-active"><div class="modal-wrapper">'+modalContent+'</div></div>')
                    $("#main .pdp-modal-active").transition({opacity:0},0).transition({opacity:1},400)
                    modal = $("#main .pdp-modal-active .modal-wrapper")
                    modal.transition({y:-(modal.height()+30)}, 0).transition({y:0}, 400)
                    $("#main .pdp-modal-active .modal-wrapper > a").click(function(e){
                        history.pushState(null, null, '#');
                        $(window).trigger('hashchange');
                    })
                    $("#main .pdp-modal-active").click(function(){
                        history.pushState(null, null, '#');
                        $(window).trigger('hashchange');
                    }).children().click(function(e) {
                        return false;
                    });
                } else {
                    modal = $("#main .pdp-modal-active .modal-wrapper")
                    modal.transition({y:-(modal.height()+30)}, 400)
                    $("#main .pdp-modal-active").transition({opacity:0},400).queue(function(){
                        $("#main .pdp-modal-active").remove()
                    })
                }
            });
        },
        wrapCTAs:function() {
            Drupal.behaviors.pdp.wrapElement("#group-banner > .group-width-wrapper", [".field-name-field-cta-button", ".field-name-field-header-cta-text"], "field-name-field-cta-wrapper");
            if($(".getstartedtabs").length==0) {
                Drupal.behaviors.pdp.wrapElement("#group-getting-started > .group-width-wrapper", [".field-name-field-getting-started-cta-button", ".field-name-field-bottom-cta-text"], "field-name-field-cta-wrapper");
            } else {
                Drupal.behaviors.pdp.wrapElement(null, [".field-name-field-getting-started-cta-button", ".field-name-field-bottom-cta-text"], "field-name-field-cta-wrapper");
            }
        },
        wrapElement:function(parentSelector, itemSelectors, wrapperClass, clearfix) {
            var banner = $(parentSelector);
            if(parentSelector==null)
                banner = $(itemSelectors[0]).parent()
            if(!banner.length) return;
            banner.each(function(){
                if(typeof(clearfix)=="undefined") clearfix=true; // clearfix option defaults to true
                $(this).append('<div class="'+wrapperClass+(clearfix?' clearfix':'')+'"></div>')
                for(var i=0;i<itemSelectors.length;i++) {
                     $(this).find("."+wrapperClass).append($(this).find(itemSelectors[i]).detach())
                }
            })
        },
    };
})(jQuery);;
(function($) {
    var animateFlag = true;
    var bgp = '',px = '',py = '',animateFlag = true;
    var magnifyload = true;
    $('div.large').hide();
    function setRoundaboutChild(upwardFlag){
    	var $arr = $(".roundabout-moveable-item");
    	var el = $(".roundabout-in-focus");
    	var index = $arr.index(el);
    	if(upwardFlag){
    		index++;
            $('.roundabout-holder').roundabout('animateToNextChild');
    	}else{
    		index--;
             $('.roundabout-holder').roundabout('animateToPreviousChild');
    	}
    	if(index < 0)
    		index = $arr.length - 1;
    	if(index >= $arr.length)
    		index = 0;
    	setContent($(".roundabout-moveable-item")[index],index);
        $('.magnifier-zoomed').tooltip('hide');
    }

    var $controls = $('#carousel-controls').find('span');

    function setContent(selector,li_index){
        slider_index = li_index;
        var $selector = $( selector );
        var magnifier_positions = window.$carousel.data("positions")
        if(magnifier_positions==null) return; // This func is not needed when .roundabout-moveable-item > .magnify exists
        $('.magnifier').fadeOut();
        $('.roundabout-moveable-item .magnifier-empty').hide();
        $('.magnifier,.magnifier-zoomed').css('display','none');
        $('.magnifier',$selector).fadeIn();

        if(li_index % 2 ==1) {
            $('.magnifier').css('left',"100%");
        } else {
            $('.magnifier').css('left',"-39%");
        }
        $('.magnifier .magnifier-empty',$selector).fadeIn();
        $('.magnifier',$selector).animate({
            left: magnifier_positions[li_index].stop,
            top:  magnifier_positions[li_index].top
        }, 1000,function(){
            $('.magnifier-zoomed',$selector).fadeIn(300)
                .tooltip('show');
        });

        $('.roundabout-content').fadeOut(function(){
            $(this).find('h2').text($selector.find('h2').text());
            $(this).find('p').text($selector.find('p').text());
            $(this).fadeIn(500);
        });
    }

    window.$carousel = $('#details')
        .roundabout({childSelector:"li img", minOpacity:1 })
        .on('animationStart',function(){
                    $('div.large').css({right:0}).hide();
        })
        .on('animationEnd', function() {
            var slideNum = $carousel.roundabout("getChildInFocus");
            $controls.removeClass('current');
            $($controls.get(slideNum)).addClass('current');
            setMagnifier(slideNum);
            setCaptionContent();
            animateFlag = true;
        });
    var magnifier_positions = null;
    if($("body").hasClass("node-type-solution-apppulse-mobile")) {
        magnifier_positions = [
            {"start":"-40%","stop":"62%","top":"16%"},
            {"start":"-40%","stop":"62%","top":"18%"},
            {"start":"-40%","stop":"16%","top":"14%"},
            {"start":"-40%","stop":"23%","top":"22%"},
            {"start":"-40%","stop":"19%","top":"16%"}
        ];
    } else if($("body").hasClass("node-type-solution-apppulse-diagnostic")) {
        magnifier_positions = [
            {"start":"-40%","stop":"65%","top":"9%"},
            {"start":"-40%","stop":"60%","top":"19%",},
            {"start":"-40%","stop":"32%","top":"29%",},
            {"start":"-40%","stop":"22%","top":"22%",},
            {"start":"-40%","stop":"32%","top":"30%",}
        ];
    } else if($("body").hasClass("node-type-solution-loadrunner")) {
        magnifier_positions = [
            {"start":"-39%","stop":"10%","top":"16%"},
            {"start":"10%","stop":"36%","top":"14.3%"},
            {"start":"31%","stop":"58.8%","top":"7%"}
        ];
    } else if($("body").hasClass("node-type-solution-fod")) {
        magnifier_positions = [
            {"start":"-40%","stop":"65%","top":"9%"},
            {"start":"-40%","stop":"69%","top":"6%",},
            {"start":"-40%","stop":"0%","top":"14%",},
            {"start":"-40%","stop":"20%","top":"17%",},
            {"start":"-40%","stop":"4%","top":"8%",}
        ];
    } else if($("body").hasClass("node-type-solution-codar")) {
        magnifier_positions = [
            {"start":"-40%","stop":"24%","top":"36%"},
            {"start":"-40%","stop":"40%","top":"28%",},
            {"start":"-40%","stop":"10%","top":"40%",},
            {"start":"-40%","stop":"36%","top":"17%",},
            {"start":"-40%","stop":"45%","top":"35%",}
        ];
    }
    window.$carousel.data("positions", magnifier_positions)

    $controls.on('click dblclick', function(event,target) {
        if(animateFlag){
            var slideNum = -1,
            i = 0, len = $controls.length;

            for (; i<len; i++) {
               if (this === $controls.get(i)) {
                  slideNum = i;
                   break;
               }
            }
            if (slideNum >= 0) {
               $('div.large').hide();
               $controls.removeClass('current');
               $(this).addClass('current');
               setContent($(".roundabout-moveable-item")[slideNum],slideNum);
               $carousel.roundabout('animateToChild', slideNum);
            }
        }
    });

    $('.roundabout-holder').roundabout({
        responsive: false,
        triggerFocusEvents: true,
        minScale: 0.7
    });
	
	
	$("#details").swiperight(function() {
		if(!$("ul#details li.roundabout-in-focus div.large").is(":visible")) {
	        $(this).roundabout('animateToPreviousChild')
	    }
    });
    $("#details").swipeleft(function() {
    	if(!$("ul#details li.roundabout-in-focus div.large").is(":visible")) {
	        $(this).roundabout('animateToNextChild')
	    }
    });

    var imgPreLoad = new Image();
    $(imgPreLoad).hide();

    $('.analysis-carousel').carousel({
        interval: false
    });
    $(".analysis-carousel").swiperight(function() {
        $(this).carousel('prev');
    });
    $(".analysis-carousel").swipeleft(function() {
        $(this).carousel('next');
    });
    $('.roundabout-moveable-item').on('click',function(event,target){
        if(!$(this).hasClass('roundabout-in-focus')){
            var $arr = $(".roundabout-moveable-item");
            var index = $arr.index(event.currentTarget);
            setContent(event.currentTarget,index);
            $('.magnifier-zoomed').tooltip('hide');
        }
    });

    $('.carousel-indicators li').on('click',function(event,target){
        var $arr = $(".carousel-inner .active");
        var index = $arr.index(event.currentTarget);
    });

    $('.analysis-carousel').on('slide.bs.carousel',function(event,target){
        var $arr = $(".carousel-inner .item");
        var index = $arr.index(event.relatedTarget);
    });


    $('#details').waypoint(function(){
        if(magnifyload){
            setMagnifier(0);
            magnifyload = false;
        }
        setTimeout(function(){
            $('.large').addClass('no-after');
        },3000);

    },{offset:200});

    $('.next').on('click', function(event){
        if(animateFlag){
            animateFlag = false;
            setRoundaboutChild(true);
            $('.roundabout-holder').roundabout('animateToNextChild');
        }
    });
    $('.prev').on('click', function(event){
        if(animateFlag){
            animateFlag = false;
            setRoundaboutChild(false);
            $('.roundabout-holder').roundabout('animateToPreviousChild');
        }
    });

    $('.roundabout-moveable-item').each(function(){
        initMagnifier(this);
    });

    function initMagnifier(that){
        var native_width = 0,
            native_height = 0,
            $magnify = $(that).find('.magnify'),
            $large = $magnify.find('div'),
            $small = $magnify.find('img');
        $large.css('background-image', 'url('+$small.attr("src")+')');
        //The mouse drag function
        $magnify.on('mousedown touchstart',function(e){
            $large.addClass('grabbing');
            $('.large').addClass('no-after');
            $magnify.on('mousemove touchmove',function(e){
                if(!native_width && !native_height)
                {
                    var image_object = new Image();
                    image_object.src = $small.attr("src");

                    native_width = image_object.width;
                    native_height = image_object.height;
                }
                else
                {
                    var magnify_offset = $(this).offset();
                    var mx = e.pageX - magnify_offset.left;
                    var my = e.pageY - magnify_offset.top;

                    // If magnifier is being dragged outside the image, keep it within the bounds of the image
                    if(mx < 1) mx = 1;
                    if(mx > ($small.width()-0)) mx = $small.width() - 1;
                    if(my < 1) my = 1;
                    if(my > ($small.height()-0)) my = $small.height() - 1;

                    if($large.is(":visible")){
                        var rx = Math.round(mx/$small.width()*native_width - $large.width()/2)*-1;
                        var ry = Math.round(my/$small.height()*native_height - $large.height()/2)*-1;

                        bgp = rx + "px " + ry + "px"; //background position as per lens position
                        px = mx - $large.width()/2; //actual x position of lens
                        py = my - $large.height()/2; //actual y position of lens

                        $large.css({left: px, top: py, backgroundPosition: bgp});
                    }
                }
                e.preventDefault();
            });
            e.preventDefault();
        });
        $magnify.on('touchend mouseup',function(e){
            $magnify.off('mousemove');
            $large.removeClass('grabbing');
            e.preventDefault();
        });
    }

    function setMagnifier(index){
        slider_index = index;
        var $magnify = $($('.roundabout-moveable-item')[index]).find('.magnify'),
            $large = $magnify.find('div');
        var bgPosition = $large.css("background-position");
        if(bgPosition==null) { return; }
        // We need to animate this a different way for IE and Firefox. $large.css("background-position-x") returns
        // undefined in IE/FF so the $.animate does not work right. Firefox only supports background-position, it
        // seems. The scecond method is slightly choppier, hence the split.
        // TODO: convert to percents instead of hard pixel counts
        if(navigator.userAgent.indexOf("Trident")==-1 && navigator.userAgent.indexOf("Firefox")==-1) {
            $large.css({left:633,top:50,backgroundPositionX:-1253,backgroundPositionY:-195}).hide();
            $large.show()
            $large.animate({
                left:309,
                backgroundPositionX:-683,
                backgroundPositionY:-195
            },1000);
        } else {
            $large.css({left:633,top:50,backgroundPosition:"-683px -195px"}).hide();
            $large.show()
            // Manually specify an array of values to change
            $({
                backgroundPositionX:-1253,
                backgroundPositionY:-195,
                left:633
            }).animate({
                backgroundPositionX:-683,
                backgroundPositionY:-195,
                left:309
            }, {duration:1000, step: function(now,tween) {
                if(tween.prop=="left") {
                    // Set left
                    $large.css("left", tween.now);
                } else {
                    // Update background-position either x or y value
                    bgPos = $large.css("background-position").split(" ")
                    if(tween.prop=="backgroundPositionX") {
                        bgPos[0]=tween.now+"px"
                    } else {
                        bgPos[1]=tween.now+"px"
                    }
                    $large.css("background-position", bgPos[0]+" "+bgPos[1])
                }
            }});
        }
    }

    function setCaptionContent(){
        var $currentContent = $('.roundabout-in-focus .roundabout-subcontent');
        var $mainContent = $('.roundabout-content');
        if ($currentContent.find('h2').text()) {
            $mainContent.find('h2').text($currentContent.find('h2').text());
            //$('.roundabout-content .screenshot-text').text($('.roundabout-in-focus .roundabout-subcontent .screenshot-text').text());
            $mainContent.find('p').text($currentContent.find('p').text());
        } else {
            var $currentContent = $('.roundabout-in-focus');
            $('.roundabout-content').find('h2').text($currentContent.find('.hidden h2').text());
        }
        //$mainContent.hide().fadeIn('slow');
    }

    function touchHandler(event) {
        var touch = event.changedTouches[0];

        var simulatedEvent = document.createEvent("MouseEvent");
        simulatedEvent.initMouseEvent({
            touchstart: "mousedown",
            touchmove: "mousemove",
            touchend: "mouseup"
        }[event.type], true, true, window, 1,
            touch.screenX, touch.screenY,
            touch.clientX, touch.clientY, false,
            false, false, false, 0, null);

        touch.target.dispatchEvent(simulatedEvent);
        // event.preventDefault();
    }

    function init() {
        document.addEventListener("touchstart", touchHandler, true);
        document.addEventListener("touchmove", touchHandler, true);
        document.addEventListener("touchend", touchHandler, true);
        document.addEventListener("touchcancel", touchHandler, true);
    }

    init();
}(jQuery));;
