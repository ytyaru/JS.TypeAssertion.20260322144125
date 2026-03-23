import { expect, test, describe, beforeEach } from "bun:test";
//import { ErrorClass } from "../src/js/assertion.js";
import {Type,Assertion,TypeAssertion,PrimitiveTypeAssertion,ReferenceTypeAssertion} from "../src/js/assertion.js";
/*
const isObj = (o) => o?.constructor === Object;
const isIns = (o) => o !== null && typeof o === 'object' && o.constructor !== Object;
const hasDescriptor(o, n) => {// oがnという名前のゲッターとセッターを定義していることを確認する
    const O = isObj(o) ? o : (isIns ? Object.getPrototypeOf(o) : (()=>{throw new TypeError(`oはObjectかインスタンスのみ有効です。`)})());
    expect(O).toHaveProperty(n);    // Oがnという名前のプロパティを持っていること
    const descriptor = Object.getOwnPropertyDescriptor(O, n); // プロパティはディスクリプタであること
    expect(descriptor).toBeDefined(); // ディスクリプタが存在すること
    return descriptor;
}
const hasDataDescriptor(o, n, value, configurable, enumerable, writable) => {// データデスクリプタを持っていること
    const descriptor = hasDescriptor(o, n);
    expect(descriptor).toHaveProperty('value');
    // 期待値が設定されていれば確認する
    const expectations = { value, configurable, enumerable, writable };
    Object.entries(expectations).forEach(([key, expectedValue]) => {
        if (expectedValue !== undefined) {
            expect(descriptor[key]).toBe(expectedValue);
        }
    });
}
const hasAccessorDescriptor(o, n, g=true, s=true) => {// アクセサデスクリプタを持っていること
    const descriptor = hasDescriptor(o, n);
    // ゲッター・セッターの存在確認
    [g ? 'get' : '', s ? 'set' : ''].filter(d=>d).map(d=>expect(descriptor[d]).toBeInstanceOf(Function))
    // 片方しかないことを確認する
    [(g && !s ? 'set' : ''), (!g && s ? : 'get': '')].filter(d=>d).map(d=>expect(descriptor[d]).toBeUndefined());
}
const hasGetterOnly(o, n) =>hasDescriptor(o,n,true,false); // oがnという名前のゲッターを定義していることを確認する
const hasSetterOnly(o, n) =>hasDescriptor(o,n,false,true); // oがnという名前のゲッターを定義していることを確認する
*/
const isObj = (o) => o?.constructor === Object;
const isIns = (o) => o !== null && typeof o === 'object' && o.constructor !== Object;
const getOwner = (o) => isObj(o) ? o : (isIns(o) ? Object.getPrototypeOf(o) : null);
const throwOwner = (o) => {
    const O = getOwner(o);
    if (!O) {throw new TypeError(`oはObjectかインスタンスのみ有効です。`)}
    return O;
}
const goBackDescriptor = (o, n) => {
    let proto = throwOwner(o);

    // プロトタイプチェーンを遡って、nを持つ最初のディスクリプタを返す
    while (proto) {
        const desc = Object.getOwnPropertyDescriptor(proto, n);
        if (desc) return [proto, desc];
        proto = Object.getPrototypeOf(proto);
    }
//    return undefined; // どこにも見つからなかった場合
    throw new Error(`oかその先祖に ${n} を持つ者はいませんでした。`)
};
const getDescriptor = (o, n, isOwn=false) => {
    const O = throwOwner(o);
    return isOwn ? [O, Object.getOwnPropertyDescriptor(O, n)] : goBackDescriptor(O, n);
}
const hasOwnDescriptor = (o, n) => {// oがnという名前のゲッターとセッターを定義していることを確認する
//    const O = throwOwner(o);
//    const descriptor = Object.getOwnPropertyDescriptor(O, n); // プロパティはディスクリプタであること
    const [O, descriptor] = getDescriptor(o, n, true);
    expect(descriptor).toBeDefined(); // ディスクリプタが存在すること
    return descriptor;
}
const hasDescriptor = (o, n) => {// oかその先祖がnという名前のゲッターとセッターを定義していることを確認する
    //const descriptor = findDescriptor(o, n);
    const [O, descriptor] = getDescriptor(o, n, false);
    expect(descriptor).toBeDefined();
    return descriptor;
};
const hasOwnDataDescriptor(o, n, value, configurable, enumerable, writable) => {// データデスクリプタを持っていること
    //const descriptor = hasOwnDescriptor(o, n);
    const [O, descriptor] = getDescriptor(o, n, true);
    expect(descriptor).toHaveProperty('value');
    // 期待値が設定されていれば確認する
    const expectations = { value, configurable, enumerable, writable };
    Object.entries(expectations).forEach(([key, expectedValue]) => {
        if (expectedValue !== undefined) {
            expect(descriptor[key]).toBe(expectedValue);
        }
    });
}
const _hasDataDescriptor(o, n, value, configurable, enumerable, writable, isOwn) => {// データデスクリプタを持っていること
    //const descriptor = hasDescriptor(o, n);
    const [O, descriptor] = getDescriptor(o, n, isOwn);
    expect(descriptor).toHaveProperty('value');
    // 期待値が設定されていれば確認する
    const expectations = { value, configurable, enumerable, writable };
    Object.entries(expectations).forEach(([key, expectedValue]) => {
        if (expectedValue !== undefined) {
            expect(descriptor[key]).toBe(expectedValue);
        }
    });
}
const hasOnwDataDescriptor = (o, n, value, configurable, enumerable, writable) => _hasDataDescriptor(o, n, value, configurable, enumerable, writable, true);
const hasDataDescriptor = (o, n, value, configurable, enumerable, writable) => _hasDataDescriptor(o, n, value, configurable, enumerable, writable, false);

const hasOwnAccessorDescriptor(o, n, g=true, s=true) => {// アクセサデスクリプタを持っていること
    //const descriptor = hasOwnDescriptor(o, n);
    const [O, descriptor] = getDescriptor(o, n, true);
    // ゲッター・セッターの存在確認
    [g ? 'get' : '', s ? 'set' : ''].filter(d=>d).map(d=>expect(descriptor[d]).toBeInstanceOf(Function))
    // ゲッター・セッターの不在確認
    [(!s ? 'set' : ''), (!g ? 'get' : '')].filter(d=>d).forEach(d=>expect(descriptor[d]).toBeUndefined());
}
const hasAccessorDescriptor(o, n, g=true, s=true) => {// アクセサデスクリプタを持っていること
    //const descriptor = hasDescriptor(o, n);
    const [O, descriptor] = getDescriptor(o, n, false);
    // ゲッター・セッターの存在確認
    [g ? 'get' : '', s ? 'set' : ''].filter(d=>d).map(d=>expect(descriptor[d]).toBeInstanceOf(Function))
    // ゲッター・セッターの不在確認
    [(!s ? 'set' : ''), (!g ? 'get' : '')].filter(d=>d).forEach(d=>expect(descriptor[d]).toBeUndefined());
}
const hasGS(o, n) =>hasAccessorDescriptor(o,n,true,true); // oがnという名前のゲッターとセッターの両方を定義していることを確認する
const hasGetterOnly(o, n) =>hasAccessorDescriptor(o,n,true,false); // oがnという名前のゲッターのみを定義していることを確認する
const hasSetterOnly(o, n) =>hasAccessorDescriptor(o,n,false,true); // oがnという名前のセッターのみを定義していることを確認する
const hasOwnGS(o, n) =>hasOwnAccessorDescriptor(o,n,true,true); // oがnという名前のゲッターとセッターの両方を定義していることを確認する
const hasOwnGetterOnly(o, n) =>hasOwnAccessorDescriptor(o,n,true,false); // oがnという名前のゲッターのみを定義していることを確認する
const hasOwnSetterOnly(o, n) =>hasOwnAccessorDescriptor(o,n,false,true); // oがnという名前のセッターのみを定義していることを確認する

describe("Assertion", () => {
    describe("想定内系", () => {
        describe("正常系", () => {
            test.each([undefined, '対象値'])("インスタンスを生成できる(%p)", (v)=>{
                const a = new Assertion(v);
                expect(a._).toBeDefined();
                expect(a._.v).toBe(v);
                expect(a).toBeInstanceOf(Assertion);
            });
        });
        describe("異常系", () => {
            test("assert()を呼び出したら未実装エラーが出るはず", () => {
                const a = new Assertion();
                expect(()=>a.assert()).toThrow("Assertion.assert(a)をオーバーライドしてください。");
            });
        });
    });
    describe("想定外系", () => {
        describe("意地悪系", () => {

        });
    });
});
describe("TypeAssertion", () => {
    describe("想定内系", () => {
        describe("正常系", () => {
            test.each([undefined, '対象値'])("インスタンスを生成できる(%p)", (v)=>{
                const a = new TypeAssertion(v);
                expect(a._).toBeDefined();
                expect(a._.v).toBe(v);
                expect(a).toBeInstanceOf(Assertion);
            });
            test.each(['p', 'r'])("所定のゲッターを持っているはず(%p)", (n)=>{
                const a = new TypeAssertion();
                expect(a).toHaveProperty(n);
                hasGetterOnly(a,n);
                // プロパティが「ゲッター」として定義されていることを確認
                const descriptor = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(a), n);
                expect(descriptor).toBeDefined();
                expect(descriptor?.get).toBeInstanceOf(Function);
            });
        });
        describe("異常系", () => {
            test("assert()を呼び出したら未実装エラーが出るはず", () => {
                const a = new Assertion();
                expect(()=>a.assert()).toThrow("Assertion.assert(a)をオーバーライドしてください。");
            });
        });
    });
    describe("想定外系", () => {
        describe("意地悪系", () => {

        });
    });
});



