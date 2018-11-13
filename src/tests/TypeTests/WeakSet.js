const test = require('tape');
const testHelpers = require('../../tests/testHelpers.js');
const jsonComplete = require('../../main.js');

const encode = jsonComplete.encode;
const decode = jsonComplete.decode;

// WeakSet is not fully supported because its internal data is not iterable, and therefore cannot be serialized.
// Attempting to encode WeakSets will create several logs and store the value as a plain, empty Object.
// However, like any Object, WeakSets can store arbitrary data via String or Symbol keys.

const startup = () => {
    const oldLog = console.log;

    let callCount = 0;

    const caller = () => {
        callCount += 1;
    };

    console.log = caller;

    return {
        getCallCount: () => {
            return callCount;
        },
        shutdown: () => {
            callCount = 0;
            console.log = oldLog;
        },
    };
};

test('WeakSet: Not Supported', (t) => {
    t.plan(2);

    const source = [{ a: { b: 2 } }];

    const decoded = decode(encode([new WeakSet(source)], {
        safeMode: true,
    }))[0];

    t.ok(testHelpers.isObject(decoded));
    t.equal(decoded.has, void 0);
});

test('WeakSet: Arbitrary Attached Data', (t) => {
    t.plan(3);

    const weakSet = new WeakSet([{ a: { b: 2 } }]);
    weakSet.x = 2;
    weakSet[Symbol.for('weakSet')] = 'test';

    const decodedWeakSet = decode(encode([weakSet], {
        safeMode: true,
    }))[0];

    t.ok(testHelpers.isObject(decodedWeakSet));
    t.equal(decodedWeakSet.x, 2);
    t.equal(decodedWeakSet[Symbol.for('weakSet')], 'test');
});

test('WeakSet: Self-Containment', (t) => {
    t.plan(2);

    const weakSet = new WeakSet([{ a: { b: 2 } }]);
    weakSet.me = weakSet;

    const decodedWeakSet = decode(encode([weakSet], {
        safeMode: true,
    }))[0];

    t.ok(testHelpers.isObject(decodedWeakSet));
    t.equal(decodedWeakSet.me, decodedWeakSet);
});

test('WeakSet: Referencial Integrity', (t) => {
    t.plan(2);

    const source = new WeakSet([{ a: 1 }]);

    const decoded = decode(encode({
        x: source,
        y: source,
    }, {
        safeMode: true,
    }));

    t.equal(decoded.x, decoded.y);
    t.notEqual(decoded.x, source);
});