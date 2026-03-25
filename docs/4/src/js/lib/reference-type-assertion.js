import { ErrorClass } from "./error-class.js";
import { PowOfTwo, BigPowOfTwo } from "./pow-of-two.js";
ErrorClass.regist('ImplementationError',  'AssertionError', 'TypeAssertionError AssertionError');
// Type.assert(somveValue, a=>a.v.bln); // 値型(value)       プリミティブ型
// Type.assert(somveValue, a=>a.r.ctn.obj); // 参照型(reference) オブジェクト型({}と区別できず紛らわしい名)
export class Type {
    static is(v, ...asserter) {return this.#is(v, ...asserter).some(r=>r);}
    static #is(v, ...asserter) { return asserter.map(ass=>{
            const a = ass(new TypeAssertion());
            return a.is(v);
        });
    }
    static throw(v, ...asserter) {// is()のあとにthrow()することになる（2回やるのは無駄だが論理的に必須）
        const ress = this.#is(v, ...asserter);
        if (ress.every(r=>!r)) {
            throw new TypeError(`どの型にも一致しなかった。`);
        }
        for (let i=0; i<ress.length; i++) {
            if (ress[i]) {return true}
        }
    }
    static throw(v, ...asserter) {// is()のあとにthrow()することになる（2回やるのは無駄だが論理的に必須）
        const ress = this.#is(v, ...asserter);
        let I = -1;
        for (let i=0; i<ress.length; i++) {
            if (ress[i]) {return true}
            else {I=i; break;}
        }
        if (-1<I) {return asserter[I].throw(v);}
//        const a = ass(new TypeAssertion());
//        return a.throw(v);
    }
    constructor(filter) {
        this._={filter:filter};
        if (undefined!==filter && !(filter instanceof TypeAssertion)) {throw new TypeError(`filterはTypeAssertion型またはその継承型であるべきです。`)}
    }
    is(v, asserter) {
        const a = asserter(new this._.filter(v) || new TypeAssertion(v));
        return a.is(v);
    }
}
export class Assertion {
    static is(v) {throw new ImplementationError(`Assertion.is(v)をオーバーライドしてください。`);}
    is(v) {throw new ImplementationError(`Assertion.is(a)をオーバーライドしてください。`);}
    throw(v) {throw new ImplementationError(`Assertion.throw(a)をオーバーライドしてください。`);}
}
export class TypeAssertion extends Assertion {
    static is(v) {return false}
    constructor(label) {this._={label:label || this.constructor.name.replaceAll('TypeAssertion','')}}
    is(v) {return this.constructor.is(v)}
    throw(v) {if (!this.constructor.is(v)) {this.#throw()}}
    #throw(cause) {throw new TypeAssertionError(`${this._.label} 型ではありません。`, cause)}
}
export class PrimitiveTypeAssertion extends TypeAssertion {
    static is(v) {return (null===this._.v || ['object','function'].every(n=>n!==typeof this._.v))}
    constructor() {super();}
    get und() {return new UndefinedTypeAssertion()}
    get nul() {return new NullTypeAssertion()}
    get bln() {return new BooleanTypeAssertion()}
    get num() {return new NumberTypeAssertion()}
    get big() {return new BigIntTypeAssertion()}
    get str() {return new StringTypeAssertion()}
    get sym() {return new SymbolTypeAssertion()}
}
export class ReferenceTypeAssertion extends TypeAssertion {
    static is(v) {return Object===v?.constructor}
    constructor() {super();}
    get mod() {return new ModuleTypeAssertion()}
    get cls() {return new ClassTypeAssertion()}
    get des() {return new DescriptorTypeAssertion()}
    get ins() {return new InstanceTypeAssertion()}
    get exe() {return new ExecutableTypeAssertion()}
    get obj() {return new ObjectTypeAssertion()}
    get ary() {return new ArrayTypeAssertion()}
    get map() {return new MapTypeAssertion()}
    get set() {return new SetTypeAssertion()}
}
/*
const primClasses = 'Undefined Null Boolean Number BigInt String Symbol'.split(' ').reduce((o,id)=>{
    const cls = class extends PrimitiveTypeAssertion {
        static is(v) {return 'Null'===id ? null===v : id.toLowerCase()===typeof v}
        constructor() {super();}
    };
    const name = `${id}TypeAssertion`;
    Object.defineProperty(cls, 'name', { value: name, configurable: true });
    o[name] = cls;
    return o;
}, {});
export const { UndefinedTypeAssertion, NullTypeAssertion, BooleanTypeAssertion, NumberTypeAssertion, BigIntTypeAssertion, StringTypeAssertion, SymbolTypeAssertion } = primClasses;
*/
export class UndefinedTypeAssertion extends PrimitiveTypeAssertion {
    static is(v) {return undefined===v}
    constructor() {super();}
}
export class NullTypeAssertion extends PrimitiveTypeAssertion {
    static is(v) {return null===v}
    constructor() {super();}
}
export class BooleanTypeAssertion extends PrimitiveTypeAssertion {
    static is(v) {return 'boolean'===typeof v}
    constructor() {super();}
    get t() {return new TrueTypeAssertion()}
    get f() {return new FalseTypeAssertion()}
}
export class NumberTypeAssertion extends PrimitiveTypeAssertion {
    static is(v) {return 'number'===typeof v}
    constructor() {super();}
    get nan() {return NaNTypeAssertion()}
    get inf() {return InfinityNumberTypeAssertion()}
    get fin() {return finiteNumberTypeAssertion()}
}
export class BigIntTypeAssertion extends PrimitiveTypeAssertion {
    static is(v) {return 'bigint'===typeof v}
    constructor() {super();}
    get s64() {return new BitBigIntTypeAssertion(64, false)}
    get u64() {return new BitBigIntTypeAssertion(64, true)}
    get s128() {return new BitBigIntTypeAssertion(128, false)}
    get u128() {return new BitBigIntTypeAssertion(128, true)}
    get s256() {return new BitBigIntTypeAssertion(256, false)}
    get u256() {return new BitBigIntTypeAssertion(256, true)}
    get s512() {return new BitBigIntTypeAssertion(512, false)}
    get u512() {return new BitBigIntTypeAssertion(512, true)}
    get s1024() {return new BitBigIntTypeAssertion(1024, false)}
    get u1024() {return new BitBigIntTypeAssertion(1024, true)}
    get s2048() {return new BitBigIntTypeAssertion(2048, false)}
    get u2048() {return new BitBigIntTypeAssertion(2048, true)}
    get s4096() {return new BitBigIntTypeAssertion(4096, false)}
    get u4096() {return new BitBigIntTypeAssertion(4096, true)}
    get s8192() {return new BitBigIntTypeAssertion(8192, false)}
    get u8192() {return new BitBigIntTypeAssertion(8192, true)}
}
class RangeTypeAssertion extends PrimitiveTypeAssertion {
    constructor(min, max, isTypeFn, expectedLabel) {
        super();
        this.#validate(min, max);
        this._.expectedLabel = expectedLabel;
        this._.isTypeFn = isTypeFn;
        if ('function'!==isTypeFn) {throw new TypeError(`isTypeFnは関数であるべきです。`)}
        if ('string'!==expectedLabel) {throw new TypeError(`expectedLabelは文字列であるべきです。`)}
    }
    #validate(min, max) {
        if (![min, max].every(v=>this.#isType(v))) {throw new TypeError(`min,maxは両方共${this._.expectedLabel}であるべきです。: min:${typeof min}, max:${typeof max}`)}
        if (max<=min) {throw new RangeError(`min,maxはmin<maxの関係であるべきです。: min:${min}, max:${max}`)}
        this._.min = min;
        this._.max = max;
    }
    is(v) {return this.#isType(v) && this.#isRange(v)}
    throw(v) {
        if (!this.#isType(v)) {throw new TypeError(`型は想定外です。型:${this._.label} 期待値:${this._.expectedLabel} 実際値:型:${v?.constructor ? v.constructor.name : typeof v}, 値:${v}`)}
        if (!this.#isRange(v)) {throw new RangeError(`値は範囲外です。型:${this._.label} 期待値:${this._.min}〜${this._.max} 実際値:${v}`)}
    }
    #isType(v) {return this._.isTypeFn(v)}
    #isRange(v) {return this._.min<=v && v<=this._.max}
}
class NumberRangeTypeAssertion extends PrimitiveTypeAssertion {
    constructor(min, max, isInt=false) {
        const n = this.#expectedTypeName(isInt);
        super(min, max, (v)=>Number[n](v), `Number.${n}()`);
    }
    #expectedTypeName(isInt) {return `is${isInt ? 'SafeInteger' : 'Finite'}`}
}
class BigIntRangeTypeAssertion extends PrimitiveTypeAssertion {
    constructor(min, max, isTypeFn, expectedLabel) {
        super(min, max, (v)=>'bigint'===typeof v, `BigInt`);
    }
}
class BigIntRangeTypeAssertion extends BigIntTypeAssertion {
    constructor(min, max) {
        super();
        this.#validate(min, max);
        this._.isInt = !!isInt;
    }
    #validate(min, max) {
        if (![min, max].every(v=>this.#isType(v))) {throw new TypeError(`min,maxは両方共BigInt値であるべきです。: min:${typeof min}, max:${typeof max}`)}
        if (max<=min) {throw new RangeError(`min,maxはmin<maxの関係であるべきです。: min:${min}, max:${max}`)}
        this._.min = min;
        this._.max = max;
    }
    is(v) {return this.#isType(v) && this.#isRange(v)}
    throw(v) {
        if (!this.#isType(v)) {throw new TypeError(`型は想定外です。型:${this._.label} 期待値:BigInt 実際値:型:${v?.constructor ? v.constructor.name : typeof v}, 値:${v}`)}
        if (!this.#isRange(v)) {throw new RangeError(`値は範囲外です。型:${this._.label} 期待値:${this._.min}〜${this._.max} 実際値:${v}`)}
    }
    #isType(v) {return 'bigint'===typeof v}
    #isRange(v) {return this._.min<=v && v<=this._.max}
}

export class BitBigIntTypeAssertion extends BigIntTypeAssertion {
    constructor(bit, unsigned=false) {
        super();
        this._.bit = bit;
        this._.unsigned = unsigned;
        const [min, max] = (new BigPowOfTwo(bit, unsigned)).range;
        this._.min = min;
        this._.max = max;
        this.#setLabel();
    }
    #setLabel() {this._.label = `${this._.unsigned ? 'Unsigned' : ''}BigInt${this._.bit}`;}
    is(v) {
        let r = super.is(v);
        if (!r) {return false}
        if (!this.#is(v)) {return false}
        return true;
    }
    throw(v) {
        super.throw(v);
        if (!this.#is(v)) {throw new RangeError(`値は範囲外です。型:${this._.label} 期待値:${this._.min}〜${this._.max} 実際値:${v}`)}
    }
    #is(v) {return this._.min<=v || v<=this._.max}
}
export class StringTypeAssertion extends PrimitiveTypeAssertion {
    static is(v) {return 'string'===typeof v}
    constructor() {super();}
    get blank() {return BlankStringTypeAssertion()}
}
export class SymbolTypeAssertion extends PrimitiveTypeAssertion {
    static is(v) {return 'symbol'===typeof v}
    constructor() {super();}
}
export class BlankStringTypeAssertion extends PrimitiveTypeAssertion {
    static is(v) {return StringTypeAssertion.is(v) && ''===v}
    constructor() {super();}
}



//const valuedTypeClasses = `false true NaN Infinity -Infinity 0 ''`.split(' ')...
class NaNTypeAssertion extends NumberTypeAssertion { // NaNは非数なのに数型の一部という矛盾した存在。困る。
    static is(v) {return Number.isNaN(v)}
    constructor() {super();}
}
class InfinityTypeAssertion extends NumberTypeAssertion {
    static is(v) {return 'POSI NEGA'.some(id=>Number[`${id}TIVE_INFINITY`]===v)}
    constructor() {super();}
    get p() {return new PositiveInfinityTypeAssertion();}
    get n() {return new NegativeInfinityTypeAssertion();}
}
class PositiveInfinityTypeAssertion extends InfinityTypeAssertion {
    static is(v) {return Number.POSITIVE_INFINITY===v}
    constructor() {super();}
}
class NegativeInfinityTypeAssertion extends InfinityTypeAssertion {
    static is(v) {return Number.NEGATIVE_INFINITY===v}
    constructor() {super();}
}
class FiniteTypeAssertion extends NumberTypeAssertion { // Number型有限数(2^53範囲外も含む)
    static is(v) {return Number.isFinite(v)}
    constructor() {super();}
}
class NumberRangeTypeAssertion extends FiniteTypeAssertion {
    constructor(min, max, isInt=false) {
        super();
        this.#validate(min, max, !!isInt);
        this._.isInt = !!isInt;
    }
    #validate(min, max, isInt) {
        if (![min, max].every(v=>this.#isType(v))) {throw new TypeError(`min,maxは両方共${this.#expectedTypeName}()が真を返す値であるべきです。: min:${min}, max:${max}`)}
        if (max<=min) {throw new RangeError(`min,maxはmin<maxの関係であるべきです。: min:${min}, max:${max}`)}
        this._.min = min;
        this._.max = max;
    }
    is(v) {return this.#isType(v) && this.#isRange(v)}
    throw(v) {
        if (!this.#isType(v)) {throw new TypeError(`型は想定外です。型:${this._.label} 期待値:${'Number.is' + this.#expectedTypeName + '()'} 実際値:型:${v?.constructor ? v.constructor.name : typeof v}, 値:${v}`)}
        if (!this.#isRange(v)) {throw new RangeError(`値は範囲外です。型:${this._.label} 期待値:${this._.min}〜${this._.max} 実際値:${v}`)}
    }
    #isType(v) {return Number[this.#expectedTypeName](v)}
    #isRange(v) {return this._.min<=v && v<=this._.max}
    get #expectedTypeName() {return `is${this._.isInt ? 'SafeInteger' : 'Finite'}`}
}
class FloatTypeAssertion extends NumberRangeTypeAssertion {
    constructor(min, max) {super(Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER, false);}
}
class IntegerTypeAssertion extends NumberRangeTypeAssertion {
    constructor(min, max) {super(Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER, true);}
}
class UnsignedFloatTypeAssertion extends NumberRangeTypeAssertion {
    constructor(min, max) {super(0, Number.MAX_SAFE_INTEGER, false);}
}
class UnsignedIntegerTypeAssertion extends NumberRangeTypeAssertion {
    constructor(min, max) {super(0, Number.MAX_SAFE_INTEGER, true);}
}
// [Unsigned/''][Float/Integer][8,16,32]TypeAssertionクラス動的生成(12)
const bitNumClasses = 'Float Integer'.map(type=>
    [false, true].map(unsigned=>
        [8,16,32].map(bit=>([type,unsigned,bit]));
    );
).reduce((o,[type,unsigned,bit])=>{
    const P = 'Integer'===type
        ? (unsigned ? UnsignedIntegerTypeAssertion : IntegerTypeAssertion)
        : (unsigned ? UnsignedFloatTypeAssertion : FloatTypeAssertion);
    const [MIN, MAX] = (new PowOfTwo(bit, unsigned)).range;
    const cls = class extends P {constructor(min, max) {super(MIN, MAX, unsigned);}};
    const clsNm = `${unsigned ? 'Unsigned' : ''}${type}${bit}TypeAssertion`;
    Object.defineProperty(CustomError, 'name', { value: clsNm, configurable: true });
    return cls;
}, {});
export const {FloatType8Assertion, UnsignedFloatType8Assertion, Float16TypeAssertion, UnsignedFloatType16Assertion, Float32TypeAssertion, UnsignedFloat32TypeAssertion, Integer8TypeAssertion, UnsignedInteger8TypeAssertion, Integer16TypeAssertion, UnsignedInteger16TypeAssertion, Integer32TypeAssertion, UnsignedInteger32TypeAssertion } = primClasses;
/*
export [UndefinedTypeAssertion, NullTypeAssertion, BooleanTypeAssertion, NumberTypeAssertion, BigIntTypeAssertion, StringTypeAssertion, SymbolTypeAssertion] = 'Undefined Null Boolean Number BigInt String Symbol'.split(' ').reduce((o,id)=>{
    const cls = class extends PrimitiveTypeAssertion {
        static is(v) {return 'Null'===id ? null===v : id.toLowerCase()===typeof v}
        constructor() {super();}
    };
    const name = `${id}TypeAssertion`;
    Object.defineProperty(cls, 'name', { value: name, configurable: true });
    o[name] = cls;
    return o;
});
export class UndefinedAssertion extends PrimitiveTypeAssertion {
    static is(v) {return undefined===v}
    constructor() {super();}
}
export class NullAssertion extends PrimitiveTypeAssertion {
    static is(v) {return null===v}
    constructor() {super();}
}
export class BooleanAssertion extends PrimitiveTypeAssertion {
    static is(v) {return 'boolean'===typeof v}
    constructor() {super();}
}
export class NumberAssertion extends PrimitiveTypeAssertion {
    static is(v) {return 'number'===typeof v}
    constructor() {super();}
}
export class BigIntAssertion extends PrimitiveTypeAssertion {
    static is(v) {return 'bigint'===typeof v}
    constructor() {super();}
}
export class StringAssertion extends PrimitiveTypeAssertion {
    static is(v) {return 'string'===typeof v}
    constructor() {super();}
}
export class SymbolAssertion extends PrimitiveTypeAssertion {
    static is(v) {return 'symbol'===typeof v}
    constructor() {super();}
}
*/
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
    }
    
    is(v) {return this.constructor.is(v)}
    throw(v) {
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
