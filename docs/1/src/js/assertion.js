import { ErrorClass } from "./error-class.js";
ErrorClass.regist('ImplementationError AssertionError', 'TypeAssertionError AssertionError');
// Type.assert(somveValue, a=>a.v.bln); // 値型(value)       プリミティブ型
// Type.assert(somveValue, a=>a.r.ctn.obj); // 参照型(reference) オブジェクト型({}と区別できず紛らわしい名)
class Type {
    assert(v, asserter) {
        const a = asserter(new TypeAssertion(v));
        a.assert(v);
    }
}
class Assertion {
    constructor(v) {this._={v:v};}
    assert(a) {throw new ImplementationError(`Assertion.assert(a)をオーバーライドしてください。`);}
}
class TypeAssertion extends Assertion {
    constructor(v) {super(v)}
    assert(a) {throw new ImplementationError(`TypeAssertion.assert(a)をオーバーライドしてください。`);}
}
class PrimitiveTypeAssertion extends TypeAssertion {
    constructor(v) {super(v)}
    assert(a) {
        if (null===this._.v || ['object','function'].every(n=>typeof this._.v !==n));
function isPrimitive(value) {
  // null と undefined, symbol, bigint, number, string, boolean をカバー
  return null===vvalue === null || (typeof value !== 'object' && typeof value !== 'function');
}
        throw new ImplementationError(`TypeAssertion.assert(a)をオーバーライドしてください。`);
    }
}
