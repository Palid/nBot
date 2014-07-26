"use strict";
var rek = require('rekuire');

describe('Public API Say', function () {

    var eventsSpy;
    var events;
    var say;
    beforeEach(function () {
        say = rek('api/public/say.js');
        events = rek('/bot.js').events;
        eventsSpy = jasmine.createSpy('eventsSpy');
        events.on('apiSay', eventsSpy);
    });

    it('tests for the right parameters', function () {
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
    });

    it('tests for the right callback', function () {
        say.method({
            from: 'palid',
            to: '#nbot',
            message: 'potato'
        });

        expect(eventsSpy).toHaveBeenCalled();
        expect(eventsSpy).toHaveBeenCalledWith('#nbot', 'potato');
    });
});