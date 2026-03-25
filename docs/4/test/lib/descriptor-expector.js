import { expect, test, describe, beforeEach } from "bun:test";
class Descriptor {
    static get(o, n, isOwn=false) {
        const O = this.#throwOwner(o);
        return isOwn ? [O, Object.getOwnPropertyDescriptor(O, n)] : this.#goBackDescriptor(O, n);
    }
    static #isObj(o){return o?.constructor === Object;}
    static #isIns(o){return o !== null && typeof o === 'object' && o.constructor !== Object;}
    static #getOwner(o) {return this.#isObj(o) ? o : (this.#isIns(o) ? Object.getPrototypeOf(o) : null);}
    static #throwOwner(o) {
        const O = this.#getOwner(o);
        if (!O) {throw new TypeError(`oはObjectかインスタンスのみ有効です。`)}
        return O;
    }
    static #goBackDescriptor(o, n) {
        let proto = this.#throwOwner(o);
        // プロトタイプチェーンを遡って、nを持つ最初のディスクリプタを返す
        while (proto) {
            const desc = Object.getOwnPropertyDescriptor(proto, n);
            if (desc) return [proto, desc];
            proto = Object.getPrototypeOf(proto);
        }
        //return undefined; // どこにも見つからなかった場合
        throw new Error(`oかその先祖に ${n} を持つ者はいませんでした。`)
    };
}
export default class DescriptorExpector {
    constructor(o, n, isOwn) {
        const [O, d] = Descriptor.get(o, n, isOwn);
        expect(d).toBeDefined(); // ディスクリプタが存在すること
        this._ = {o:O, d:d};
    }
    get hasG() {this.#verify({get:true, set:false});}
    get hasS() {this.#verify({get:false, set:true});}
    get hasGS() {this.#verify({get:true, set:true});}
    value(value, configurable, enumerable, writable) {
        expect(this._.d).toHaveProperty('value');
        this.#verify({ value, configurable, enumerable, writable });
    }
    #verify(expectations) {
        Object.entries(expectations).forEach(([key, expectedValue]) => {
            if (expectedValue !== undefined) {
                const target = this._.d[key];
                if (key === 'get' || key === 'set') {
                    expectedValue === true 
                        ? expect(target).toBeInstanceOf(Function)
                        : expect(target).toBeUndefined();
                } else {
                    if (undefined===target) {return}
                    else if ('function'===typeof target) {expect(target).toBeFunction()}
                    else {expect(target).toBe(expectedValue);}
                }
            }
        });
    }
}


