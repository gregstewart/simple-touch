var SimpleTouch = SimpleTouch || {};
SimpleTouch.utils =  {};

(function () {
    'use strict';
    var swipeTriggerDistance = 30, self = this;

    self.isSwipe = function (x1, x2, y1, y2) {
        return (x2 && Math.abs(x1 - x2) > swipeTriggerDistance) || (y2 && Math.abs(y1 - y2) > swipeTriggerDistance);
    };

    self.swipeDirection = function (x1, x2, y1, y2) {
        var xDelta = Math.abs(x1 - x2), yDelta = Math.abs(y1 - y2);
        return xDelta >= yDelta ? (x1 - x2 > 0 ? 'Left' : 'Right') : (y1 - y2 > 0 ? 'Up' : 'Down');
    };

    self.getTarget = function (e) {
        if (e.originalEvent) {
            return e.originalEvent.touches[0];
        }
        return e;
    };

}).apply(SimpleTouch.utils);