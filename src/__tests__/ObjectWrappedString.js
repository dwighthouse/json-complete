const test = require('tape');
const jsonComplete = require('../main.js');

const encode = jsonComplete.encode;
const decode = jsonComplete.decode;

test('Object-Wrapped String: Normal', (t) => {
    t.plan(3);

    const decodedValue = decode(encode([new String('test')]))[0];

    t.equal(typeof decodedValue, 'object');
    t.equal(Object.prototype.toString.call(decodedValue), '[object String]');
    t.equal(String.prototype.valueOf.call(decodedValue), 'test');
});

test('Object-Wrapped String: Empty String', (t) => {
    t.plan(3);

    const decodedValue = decode(encode([new String('')]))[0];

    t.equal(typeof decodedValue, 'object');
    t.equal(Object.prototype.toString.call(decodedValue), '[object String]');
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
