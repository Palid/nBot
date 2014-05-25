"use strict";
jest.dontMock('lodash');
jest.dontMock('../alias.js');

describe('Public API Say', function () {

    var eventsSpy;
    var events;
    var config;
    beforeEach(function () {
        events = require('../../../core/events.js');
        config = require('../../../core/initialize/parseJSON.js');
        eventsSpy = jasmine.createSpy('eventsSpy');
        events.on('apiSay', eventsSpy);
    });

    it('tests for channel call', function () {
        var say = require('../alias.js');
        spyOn(say, 'method');
        say.method({
            from: 'palid',
            to: '#nbot',
            message: 'alias'
        });

        expect(say.method).toHaveBeenCalled();
        expect(say.method).toHaveBeenCalledWith({
            from: 'palid',
            to: '#nbot',
            message: 'alias'
        });
    });

    it('tests for simple aliases only response', function () {
        var say = require('../alias.js');
        say.method({
            from: 'palid',
            to: '#nbot',
            message: 'say'
        });

        expect(eventsSpy).toHaveBeenCalled();
        expect(eventsSpy).toHaveBeenCalledWith('#nbot', 'Simple aliases for say: s');
    });

    it('tests for complex aliases only response', function () {
        var say = require('../alias.js');
        say.method({
            from: 'palid',
            to: '#nbot',
            message: 'complexMock'
        });

        expect(eventsSpy).toHaveBeenCalled();
        expect(eventsSpy).toHaveBeenCalledWith('#nbot', 'Complex aliases for complexMock: complex');
    });

    it('tests for simple aliases only response', function () {
        var say = require('../alias.js');
        say.method({
            from: 'palid',
            to: '#nbot',
            message: 'fivehundred_px'
        });

        expect(eventsSpy).toHaveBeenCalled();
        expect(eventsSpy.calls.length).toEqual(2);
        expect(eventsSpy.calls[0].args[1]).toEqual('Simple aliases for fivehundred_px: 500, px');
        expect(eventsSpy.calls[1].args[1]).toEqual('Complex aliases for fivehundred_px: nude');
    });

});