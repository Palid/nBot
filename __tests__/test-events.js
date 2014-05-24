/** undef: false **/
"use strict";

describe('Events emitter', function () {
    var events;
    var spyEvents;

    beforeEach(function () {
        events = require('../core/events.js');
        spyEvents = jasmine.createSpy('spyEvents');
    });

    it('tests response with string', function () {
        events.on('apiResponse', spyEvents);
        events.emit('apiResponse', '#nBot', 'palid', 'message');
        expect(spyEvents).toHaveBeenCalled();
        expect(spyEvents).toHaveBeenCalledWith('#nBot', 'palid', 'message');
    });

    it('tests response with array', function () {
        events.on('apiResponse', spyEvents);
        events.emit('apiResponse', '#nBot', 'palid', ['message', 'message2']);
        expect(spyEvents).toHaveBeenCalled();
        expect(spyEvents).toHaveBeenCalledWith('#nBot', 'palid', ['message', 'message2']);
    });


});