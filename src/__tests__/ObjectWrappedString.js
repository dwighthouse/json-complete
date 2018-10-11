const test = require('tape');
const jsonComplete = require('../main.js');
const testHelpers = require('../../_tools/testHelpers.js');

const encode = jsonComplete.encode;
const decode = jsonComplete.decode;

test('Object-Wrapped String: Normal', (t) => {
    t.plan(3);

    const decodedValue = decode(encode([new String('test')]))[0];

    t.equal(typeof decodedValue, 'object');
    t.equal(testHelpers.systemName(decodedValue), '[object String]');
    t.equal(String.prototype.valueOf.call(decodedValue), 'test');
});

test('Object-Wrapped String: Empty String', (t) => {
    t.plan(3);

    const decodedValue = decode(encode([new String('')]))[0];

    t.equal(typeof decodedValue, 'object');
    t.equal(testHelpers.systemName(decodedValue), '[object String]');
    t.equal(String.prototype.valueOf.call(decodedValue), '');
});

test('Object-Wrapped String: Root Value Normal', (t) => {
    t.plan(3);

    const decodedValue = decode(encode(new String('test')));

    t.equal(typeof decodedValue, 'object');
    t.equal(testHelpers.systemName(decodedValue), '[object String]');
    t.equal(String.prototype.valueOf.call(decodedValue), 'test');
});

test('Object-Wrapped String: Root Value Empty String', (t) => {
    t.plan(3);

    const decodedValue = decode(encode(new String('')));

    t.equal(typeof decodedValue, 'object');
    t.equal(testHelpers.systemName(decodedValue), '[object String]');
    t.equal(String.prototype.valueOf.call(decodedValue), '');
});

test('Object-Wrapped String: Arbitrary Attached Data', (t) => {
    t.plan(3);

    const str = new String('string');
    str.x = 2;
    str[Symbol.for('string')] = 'test';

    const decodedStringObj = decode(encode([str]))[0];

    t.equal(String.prototype.valueOf.call(decodedStringObj), 'string');
    t.equal(decodedStringObj.x, 2);
    t.equal(decodedStringObj[Symbol.for('string')], 'test');
});

test('Object-Wrapped String: Self-Containment', (t) => {
    t.plan(2);

    const str = new String('string');
    str.me = str;

    const decodedStringObj = decode(encode([str]))[0];

    t.equal(String.prototype.valueOf.call(decodedStringObj), 'string');
    t.equal(decodedStringObj.me, decodedStringObj);
});

test('Object-Wrapped String: Referencial Integrity', (t) => {
    t.plan(2);

    const source = new String('test');

    const decoded = decode(encode({
        x: source,
        y: source,
    }));

    t.equal(decoded.x, decoded.y);
    t.notEqual(decoded.x, source);
});
