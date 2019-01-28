const test = require('tape');
const jsonComplete = require('/main.js');
const StandardObjectTests = require('/tests/StandardObjectTests.js');
const testHelpers = require('/tests/testHelpers.js');

const encode = jsonComplete.encode;
const decode = jsonComplete.decode;

if (typeof Set === 'function') {
    test('Set: Normal', (t) => {
        t.plan(4);

        const source = [1, 2, 'test', { a: { b: 2 } }];

        const decoded = decode(encode([new Set(source)]))[0];

        let i = 0;
        decoded.forEach((v) => {
            if (!testHelpers.isObject(v)) {
                t.equal(source[i], v);
            }
            else {
                t.equal(source[i].a.b, v.a.b);
            }
            i += 1;
        });
    });

    test('Set: Root Value', (t) => {
        t.plan(4);

        const source = [1, 2, 'test', { a: { b: 2 } }];

        const decoded = decode(encode(new Set(source)));

        let i = 0;
        decoded.forEach((v) => {
            if (!testHelpers.isObject(v)) {
                t.equal(source[i], v);
            }
            else {
                t.equal(source[i].a.b, v.a.b);
            }
            i += 1;
        });
    });

    test('Set: void 0', (t) => {
        t.plan(1);
        const decoded = decode(encode([new Set([void 0])]))[0];
        let value;
        decoded.forEach((v) => {
            value = v;
        });
        t.equal(value, void 0);
    });

    test('Set: -0 (Sets do not store -0, only 0: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set#Value_equality )', (t) => {
        t.plan(2);
        const decoded = decode(encode([new Set([-0])]))[0];
        let value;
        decoded.forEach((v) => {
            value = v;
        });
        t.notOk(testHelpers.isNegativeZero(value));
        t.equal(value, 0);
    });

    test('Set: Object Inside', (t) => {
        t.plan(2);

        const decoded = decode(encode([new Set([{}])]))[0];
        let value;
        decoded.forEach((v) => {
            value = v;
        });

        t.ok(testHelpers.isObject(value));
        t.equal(Object.keys(value).concat(Object.getOwnPropertySymbols(value)).length, 0);
    });

    test('Set: Referential Integrity Within and Without', (t) => {
        t.plan(2);

        const obj = {
            a: {
                b: 2,
            },
        };

        const set = new Set([obj]);
        set.obj = obj;

        const decoded = decode(encode([set]))[0];
        let value;
        decoded.forEach((v) => {
            value = v;
        });

        t.equal(value.a.b, decoded.obj.a.b);
        t.equal(value, decoded.obj);
    });

    StandardObjectTests('Set', 'Set', () => {
        return new Set([3]);
    });

    test('Set: Encoding Expected', (t) => {
        t.plan(1);

        const source = new Set([true]);
        source.b = false;

        t.deepEqual(testHelpers.simplifyEncoded(encode(source)), {
            U: [
                [
                    [
                        'T',
                    ],
                    [
                        'S0',
                    ],
                    [
                        'F',
                    ],
                ],
            ],
            S: [
                'b',
            ],
            r: 'U0',
        });
    });
}
else {
    console.warn('Tests for Set type skipped because it is not supported in the current environment.'); // eslint-disable-line no-console
}
