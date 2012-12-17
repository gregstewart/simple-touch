describe('swipe events', function () {
    /*
    * Lifted from Zepto.js tests
     * */
    // Fire a simulated touch event.
    // While it is possible to fire real touch events,
    // there are cross-browser issues, and this way we
    // can test touch events in browsers that don't
    // actually support touch input (like desktop Safari).
    //
    // Zepto's touch module only uses the `pageX/Y` and `target`
    // properties of the first touch in the `touches` TouchList

    function fire(type, element, x, y) {
        var event = document.createEvent('Event'),
            touch = { pageX: x, pageY: y, target: element }

        event.initEvent('touch'+type, true, true)
        event.touches = [touch]

        element.dispatchEvent(event)
    }

    function down(element, x, y) {
        fire('start', element, x, y)
    }

    function move(element, x,y) {
        fire('move', element, x, y)
    }

    function up(element) {
        fire('end', element)
    }

    beforeEach(function () {
        setFixtures(sandbox());
        $('#sandbox').css({width: '500px', height: '500px'});
        this.element = $('#sandbox').get(0);
    });

    it('should handle a tap event', function () {
        var count = 0;
        var spy = function() {
            count++
        };

        $('#sandbox').on('singleTap', spy);

        runs(function ()  {
            down(this.element, 10, 10);
            up(this.element);
        });
        waits(250);
        runs(function () {
            expect(count).toBe(1);
        })
    });

    it('should handle a double tap event', function () {
        var singleCount = 0, doubleCount = 0;

        $('#sandbox').on('singleTap', function(e){
            singleCount++
        }).on('doubleTap', function(e){
            doubleCount++
        });

        runs(function ()  {
            var self = this;
            down(self.element, 10, 10);
            up(self.element);
            setTimeout(function () {
                down(self.element, 12, 12);
                up(self.element);
            }, 100);
        });

        waits(101);

        runs(function() {
            expect(singleCount).toBe(0);
            expect(doubleCount).toBe(1);
        });

    });

    it('should handle a long tap event', function () {
        var count = 0;
        var spy = function() {
            count++
        };

        $('#sandbox').on('longTap', spy);

        runs(function ()  {
            down(this.element, 10, 10);
        });
        waits(900);
        runs(function() {
            up(this.element);
        });
        runs(function () {
            expect(count).toBe(1);
        });
    });

    it('should not handle a long tap event', function () {
        var count = 0;
        var spy = function() {
            count++
        };

        $('#sandbox').on('longTap', spy);

        runs(function ()  {
            down(this.element, 10, 10);
        });
        waits(600);
        runs(function() {
            up(this.element);
        });
        runs(function () {
            expect(count).toBe(0);
        });
    });

    it('should not trigger a long tap if the finger moves', function () {
        var count = 0;
        var spy = function() {
            count++
        };

        $('#sandbox').on('longTap', spy);

        runs(function ()  {
            down(this.element, 10, 10);
        });
        waits(450);
        runs(function() {
            move(this.element, 30, 10);
        });
        waits(450);
        runs(function() {
            up(this.element);
        });
        runs(function () {
            expect(count).toBe(0);
        })
    });

    describe('swipe utilities', function () {
        it('should return true for the right x and ys', function () {
            var x1 = 0, x2 = 40, y1 = 0, y2 = 40;

            expect(SimpleSwipe.utils.isSwipe(x1, x2, y1, y2)).toBeTruthy();
        });
        it('should handle a swipe left event', function () {
            var x1 = 0, x2 = 40, y1 = 0, y2 = 0;

            expect(SimpleSwipe.utils.swipeDirection(x1, x2, y1, y2)).toBe('Right');
        });

        it('should handle a swipe right event', function () {
            var x1 = 0, x2 = -40, y1 = 0, y2 = 0;

            expect(SimpleSwipe.utils.swipeDirection(x1, x2, y1, y2)).toBe('Left');
        });

        it('should handle a swipe up event', function () {
            var x1 = 0, x2 = 0, y1 = 0, y2 = -40;

            expect(SimpleSwipe.utils.swipeDirection(x1, x2, y1, y2)).toBe('Up');
        });

        it('should handle a swipe down event', function () {
            var x1 = 0, x2 = 0, y1 = 0, y2 = 40;

            expect(SimpleSwipe.utils.swipeDirection(x1, x2, y1, y2)).toBe('Down');
        });
    });

    it('should call a left swipe event call back', function () {
        var count = 0;
        var spy = function() {
            count++
        };

        $('#sandbox').on('swipeLeft', spy);

        runs(function ()  {
            down(this.element, 10, 10);
        });
        waits(50);
        runs(function() {
            move(this.element, -40, 10);
        });
        waits(50);
        runs(function() {
            up(this.element);
        });
        waits(50);
        runs(function () {
            expect(count).toBe(1);
        })
    });
});