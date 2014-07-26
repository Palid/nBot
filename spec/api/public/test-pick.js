"use strict";

describe('Public API Pick', function () {

    var eventsSpy;
    var events;
    beforeEach(function () {
        events = require('../../../core/events.js');
        eventsSpy = jasmine.createSpy('eventsSpy');
        events.on('apiSay', eventsSpy);
    });

    it('tests for channel call', function () {
        var method = require('../pick.js');
        spyOn(method, 'method');
        method.method({
            from: 'palid',
            to: '#nbot',
            message: 'dog bone potato kitten'
        });

        expect(method.method).toHaveBeenCalled();
        expect(method.method).toHaveBeenCalledWith({
            from: 'palid',
            to: '#nbot',
            message: 'dog bone potato kitten'
        });
    });

    it('tests for mocked data', function () {
        var method = require('../pick.js');
        var message = 'dog bone potato kitten';
        method.method({
            from: 'palid',
            to: '#nbot',
            message: message
        });
        expect(eventsSpy).toHaveBeenCalled();

        expect(eventsSpy).toHaveBeenCalledWith('#nbot', 'potato > dog > bone > kitten');

    });
});