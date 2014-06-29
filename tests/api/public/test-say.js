"use strict";
jest.dontMock('../say.js');

describe('Public API Say', function () {

    var eventsSpy;
    var events;
    beforeEach(function () {
        events = require('../../../core/events.js');
        eventsSpy = jasmine.createSpy('eventsSpy');
        events.on('apiSay', eventsSpy);
    });

    it('tests for the right parameters', function () {
        var say = require('../say.js');
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
        var say = require('../say.js');
        say.method({
            from: 'palid',
            to: '#nbot',
            message: 'potato'
        });

        expect(eventsSpy).toHaveBeenCalled();
        expect(eventsSpy).toHaveBeenCalledWith('#nbot', 'potato');
    });

});