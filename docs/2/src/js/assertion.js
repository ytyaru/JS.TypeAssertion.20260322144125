import { ErrorClass } from "./error-class.js";
ErrorClass.regist('ImplementationError',  'AssertionError', 'TypeAssertionError AssertionError');
// Type.assert(somveValue, a=>a.v.bln); // 値型(value)       プリミティブ型
// Type.assert(somveValue, a=>a.r.ctn.obj); // 参照型(reference) オブジェクト型({}と区別できず紛らわしい名)

export class Type {
    assert(v, asserter) {
        const a = asserter(new TypeAssertion(v));
        a.assert(v);
    }
}
export class Assertion {
    constructor(v) {this._={v:v};}
    assert(a) {throw new ImplementationError(`Assertion.assert(a)をオーバーライドしてください。`);}
}
export class TypeAssertion extends Assertion {
    static throw(msg, cause) {throw new TypeAssertionError(msg, cause)}
    constructor(v) {super(v)}
    assert(a) {throw new ImplementationError(`TypeAssertion.assert(a)をオーバーライドしてください。`);}
    get p() {return new PrimitiveTypeAssertion(this._.v)}
    get r() {return new ReferenceTypeAssertion(this._.v)}
}
export class PrimitiveTypeAssertion extends TypeAssertion {
    static is(v) {return (null===this._.v || ['object','function'].every(n=>n!==typeof this._.v))}
    constructor(v) {super(v)}
    assert(a) {
        if (!PrimitiveTypeAssertion.is(this._.v)) {TypeAssertion.throw(`プリミティブ型ではありません。リファレンス型です。`);}
    }
    get und() {return new UndefinedTypeAssertion(this._.v)}
    get nul() {return new NullTypeAssertion(this._.v)}
    get bln() {return new BooleanTypeAssertion(this._.v)}
    get num() {return new NumberTypeAssertion(this._.v)}
    get int() {return new BigIntTypeAssertion(this._.v)}
    get str() {return new StringTypeAssertion(this._.v)}
    get sym() {return new SymbolTypeAssertion(this._.v)}
}
export class ReferenceTypeAssertion extends TypeAssertion {
    static is(v) {return !PrimitiveTypeAssertion.is(v)}
    constructor(v) {super(v)}
    assert(a) {
        if (!PrimitiveTypeAssertion.is(this._.v)) {TypeAssertion.throw(`リファレンス型ではありません。プリミティブ型です。`);}
    }
    get exe() {return new ExecutableTypeAssertion(this._.v)}
    get ctn() {return new ContainerTypeAssertion(this._.v)}
    get cls() {return new ClassTypeAssertion(this._.v)}
    get ins() {return new InstanceTypeAssertion(this._.v)}
}
// --------------------------------
// プリミティブ型
// --------------------------------
// --------------------------------
// リファレンス型
// --------------------------------
