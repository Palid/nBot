/** undef: false **/
"use strict";
jest.dontMock('../../api/public/say.js');

describe('Public API Say', function () {

    var spyEvents;
    var events;
    beforeEach(function () {
        require('../../core/events.js');
        events = require('../../core/events.js');
        spyEvents = jasmine.createSpy('spyEvents');
        events.on('apiSay', spyEvents);
        console.log(spyEvents);
    });

    it('tests response with string', function () {
        var say = require('../../api/public/say.js');
        spyOn(say, 'method');
        say.method({
            from: 'palid',
            to: '#nbot',
            message: 'potato'
        });
        expect(say.method).toHaveBeenCalled();
        expect(say.method).toHaveBeenCalledWith({
            from: 'palid',
            to: '#nbot',
            message: 'potato'
        });

        events.emit('apiSay', 'test', 'test');
        expect(spyEvents).toHaveBeenCalled();
        // events.on('apiResponse', spyEvents);
    });


});