"use strict";
var rek = require('rekuire');
var mongoose = require('mongoose');
var mockgoose = require('mockgoose');
mockgoose(mongoose);


describe('Public API Alias', function () {

    var eventsSpy;
    var method;
    var events;
    beforeEach(function () {
        events = rek('/bot.js').events;
        method = rek('api/public/alias.js');
        eventsSpy = jasmine.createSpy('eventsSpy');
        events.on('apiSay', eventsSpy);
    });

    it('tests for channel call', function () {
        spyOn(method, 'method');

        runs(function () {
            method.method({
                from: 'palid',
                to: '#nbot',
                message: 'alias'
            });
        });

        waitsFor(function () {
            return method;
        }, "Database time out.", 5000);

        runs(function () {
            expect(method.method).toHaveBeenCalled();
            expect(method.method).toHaveBeenCalledWith({
                from: 'palid',
                to: '#nbot',
                message: 'alias'
            });
            expect(eventsSpy).toHaveBeenCalled();
        });


    });

    it('tests for simple aliases only response', function () {

        waitsFor(function () {
            return method;
        }, "Database time out.", 5000);

        runs(function () {
            expect(eventsSpy).toHaveBeenCalled();
            expect(eventsSpy).toHaveBeenCalledWith('#nbot', 'Simple aliases for say: s');
        });

        method.method({
            from: 'palid',
            to: '#nbot',
            message: 'say'
        });

    });

    // it('tests for complex aliases only response', function () {
    //     method.method({
    //         from: 'palid',
    //         to: '#nbot',
    //         message: 'complexMock'
    //     });

    //     expect(eventsSpy).toHaveBeenCalled();
    //     expect(eventsSpy).toHaveBeenCalledWith('#nbot', 'Complex aliases for complexMock: complex');
    // });

    // it('tests for simple aliases only response', function () {
    //     method.method({
    //         from: 'palid',
    //         to: '#nbot',
    //         message: 'fivehundred_px'
    //     });

    //     expect(eventsSpy).toHaveBeenCalled();
    //     expect(eventsSpy.calls.length).toEqual(2);
    // expect(eventsSpy.calls[0].args[1]).toEqual('Simple aliases for fivehundred_px: 500, px');
    // expect(eventsSpy.calls[1].args[1]).toEqual('Complex aliases for fivehundred_px: nude');
    // });

});