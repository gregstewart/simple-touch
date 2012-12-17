var SimpleTouch = SimpleTouch || {};
(function (SimpleTouch, $) {
    'use strict';
    var touch = {}, touchTimeout, longTapDelay = 750, longTapTimeout, swipeTimeout, self = this;

    function longTap() {
        longTapTimeout = null;
        if (touch.last) {
            touch.el.trigger('longTap');
            touch = {};
        }
    }

    function cancelLongTap() {
        if (longTapTimeout) {
            clearTimeout(longTapTimeout);
        }
        longTapTimeout = null;
    }

    function cancelAll() {
        if (touchTimeout) clearTimeout(touchTimeout);
        if (longTapTimeout) clearTimeout(longTapTimeout);
        if (swipeTimeout) clearTimeout(swipeTimeout);
        touchTimeout = longTapTimeout = swipeTimeout= null;
        touch = {};
    }

    $(document).ready(function () {
        var now, touchDiff;

        $(document).on('touchstart', function(e) {
            var eventTarget = SimpleTouch.utils.getTarget(e);
            now = Date.now();
            touchDiff = now - (touch.last || now);

            if(touchTimeout) {
                clearTimeout(touchTimeout);
            }

            if (touchDiff > 0 && touchDiff <= 250) {
                touch.isDoubleTap = true;
            }

            touch.el = $(eventTarget.target);
            touch.x1 = eventTarget.pageX;
            touch.y1 = eventTarget.pageY;

            touch.last = now;

            longTapTimeout = setTimeout(longTap, longTapDelay);

        }).on('touchmove', function (e) {
            var eventTarget = SimpleTouch.utils.getTarget(e);
            cancelLongTap();
            touch.x2 = eventTarget.pageX;
            touch.y2 = eventTarget.pageY;
        }).on('touchend', function (e) {
            cancelLongTap();

            if (SimpleTouch.utils.isSwipe(touch.x1, touch.x2, touch.y1, touch.y2)) {
                swipeTimeout = setTimeout(function() {
                    touch.el.trigger('swipe');
                    touch.el.trigger('swipe' + (SimpleTouch.utils.swipeDirection(touch.x1, touch.x2, touch.y1, touch.y2)));
                    touch = {};
                }, 0);
            } else if('last' in touch) {
                // trigger universal 'tap' with the option to cancelTouch()
                // (cancelTouch cancels processing of single vs double taps for faster 'tap' response)
                var event = $.Event('tap');
                event.cancelTouch = cancelAll;
                touch.el.trigger(event);

                // double
                if(touch.isDoubleTap) {
                    touch.el.trigger('doubleTap');
                    touch = {};
                } else {
                    //single
                    touchTimeout = setTimeout(function(){
                        touchTimeout = null;
                        touch.el.trigger('singleTap');
                        touch = {};
                    }, 250);
                }
            }
        }).bind('touchcancel', cancelAll);

        $(window).bind('scroll', cancelAll);
    });

    ['tap', 'singleTap', 'doubleTap', 'longTap', 'swipe', 'swipeLeft', 'swipeRight', 'swipeUp', 'swipeDown'].forEach(function (event) {
        $.fn[event] = function (callback) {
            return this.on(event, callback);
        };
    });
}(SimpleTouch, $));