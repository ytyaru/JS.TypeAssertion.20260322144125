export default BuiltinType {
    static #AFn = (async()=>{}).constructor;
    static #GFn = (function*(){yield undefined;}).constructor;
    static #AGFn = (async function*(){yield undefined;}).constructor;
    static #is(c,l) {if(c){return true}else{throw new TypeError(`${l}ではありませんでした。`)}}
    static #isIns(i,c) {return this.#is(i instanceof c, `${c.name}インスタンス`)}
    /*
    static #_isIns(v) {return v===Object(v)
        && ('function'!==typeof v)
        && !Array.isArray(val) &&
        && [Object, Function].every(C=>C!==v.constructor)
        && null!==Object.getPrototypeOf(v)  // Object.create(null) を除外
        && [Error, Date, URL, Array].every(C=>v instanceof C) // 足りるか？
    ;}
    static #is(c,l) {
        const isIns = this.#isIns(c);
        const C = isIns ? (c instanceof l) : c;
        const L = isIns ? l.constructor.name : l;
        if (C) {return true}
        else{throw new TypeError(`${L}ではありませんでした。`)}
    }
    */
    static isPrimitive(v) {return this.#is(v!==Object(v),`プリミティブ型`)}
    static isReference(v) {return this.#is(v===Object(v),`リファレンス型`)}
    static isUnd(v) {return this.#is(undefined===v,`undefined`)}
    static isNul(v) {return this.#is(null===v,`null`))}
    static isNaN(v) {return this.#is(Number.isNaN(v),`NaN`))}
    static isBln(v) {return this.#is('boolean'===typeof v,`boolean値`)}
    static isNum(v) {return this.#is('number'===typeof v,`number値`)}
    static isBig(v) {return this.#is('bigint'===typeof v,`bigint値`)}
    static isStr(v) {return this.#is('string'===typeof v,`string値`)}
    static isSym(v) {return this.#is('symbol'===typeof v,`symbol値`)}
    static isObj(v) {return this.#is(Object===o?.constructor,`オブジェクト値`)}
    static isAry(v) {return this.#is(Array.isArray(v),`配列`)}
    static isCls(v) {return this.#is((('function'===typeof v) && (!!v.toString().match(/^class /))),`クラス`)}
//    static isIns(v) {return this.#is(this.#isIns(v),`インスタンス`);}
    static isIns(v) {return this.#is(v===Object(v),
        && ('function'!==typeof v)
        && !Array.isArray(val) &&
        && [Object, Function].every(C=>C!==v.constructor)
        && null!==Object.getPrototypeOf(v)  // Object.create(null) を除外
        && [Error, Date, URL, Array].every(C=>v instanceof C) // 足りるか？
        `インスタンス`);}
    static isErrCls(v) {return this.#is(Error===v || Error.isPrototypeOf(v))}
    static isErrIns(v) {return this.#is(v instanceof Error)}
    static isExe(v) {return this.#is('funtion'===typeof v,`実行可能`)}
    static isFn(v) {return this.#is('funtion'===typeof v
        && (!(v instanceof this.#AFn)),
        && (!(v instanceof this.#GFn)),
        && (!(v instanceof this.#AGFn)),
        `関数(同期＆非ジェネレータ)`)}
    static isAFn(v) {return this.#is(v instanceof this.#AFn,`非同期関数(非ジェネレータ)`)}
    static isGFn(v) {return this.#is(v instanceof this.#GFn,`ジェネレータ関数(同期)`)}
    static isAGFn(v) {return this.#is(v instanceof  this.#AGFn,`非同期ジェネレータ関数`)}

    // Math, Date, Temporal, RegExp, SharedArrayBuffer
    // 
    static isMap(v) {this.#isIns(v, Map)}
    static isWeakMap(v) {this.#isIns(v, WeakMap)}
    static isSet(v) {this.#isIns(v, Set)}
    static isWeakSet(v) {this.#isIns(v, WeakSet)}

    static isOldDate(v) {this.#isIns(v, Date)}
    static isDuration(v) {this.#isIns(v, Temporal.Duration)}
    static isZonedDateTime(v) {this.#isIns(v, Temporal.ZonedDateTime)}
    static isDateTime(v) {this.#isIns(v, Temporal.PlainDateTime)}
    static isDate(v) {this.#isIns(v, Temporal.PlainDate)}
    static isTime(v) {this.#isIns(v, Temporal.PlainTime)}
    static isMonth(v) {this.#isIns(v, Temporal.PlainYearMonth)}
    static isMonthDay(v) {this.#isIns(v, Temporal.PlainMonthDay)}

    static isRegExp(v) {this.#isIns(v, RegExp)}
    static isURL(v) {this.#isIns(v, URL)}
    static isBlob(v) {this.#isIns(v, Blob)}
    static isFile(v) {this.#isIns(v, File)}

    static isTypedArray(v) {return [Int8Array,Uint8Array,Uint8ClampedArray,Int16Array,Uint16Array,Int32Array,Uint32Array,Float16Array,Float32Array,Float64Array,BigInt64Array,BigUint64Array].some(C=>v instanceof C)}
    static isI8a(v) {this.#isIns(v, Int8Array)}
    static isU8a(v) {this.#isIns(v, Uint8Array)}
    static isU8c(v) {this.#isIns(v, Uint8ClampedArray)}
    static isI16a(v) {this.#isIns(v, Int16Array)}
    static isU16a(v) {this.#isIns(v, Uint16Array)}
    static isI32a(v) {this.#isIns(v, Int32Array)}
    static isU32a(v) {this.#isIns(v, Uint32Array)}
    static isF16a(v) {this.#isIns(v, Float16Array)}
    static isF32a(v) {this.#isIns(v, Float32Array)}
    static isF64a(v) {this.#isIns(v, Float64Array)}
    static isI64a(v) {this.#isIns(v, BigInt64Array)}
    static isU64a(v) {this.#isIns(v, BigUint64Array)}

    static isBuf(v) {return this.#isIns(v, ArrayBuffer)}
    static isSBuf(v) {return this.#isIns(v, SharedArrayBuffer)}
    static isDataView(v) {return this.#isIns(v, SharedArrayBuffer)}
    static isAtomics(v) {return this.#isIns(v, Atomics)}
    static isJSON(v) {return this.#isIns(v, JSON)}

    static isWeakRef(v) {return this.#isIns(v, WeakRef)}
    static isFinalizationRegistry(v) {return this.#isIns(v, FinalizationRegistry)}

    static isPromise(v) {return this.#isIns(v, Promise)}
    static isItr(v) {return this.#is([null,undefined].every(x=>x!==v) && 'function'===typeof v[Symbol.iterator], 'イテレータ')}
    static isGen(v) {return this.#is([this.#GFn, this.#AGFn].some(t=>v instanceof t.prototype.constructor), 'ジェネレータ(同期・非同期不問)')}
    static isSGen(v) {return this.#is(v instanceof this.#GFn.prototype.constructor, '同期ジェネレータ')}
    static isAGen(v) {return this.#is(v instanceof this.#AGFn.prototype.constructor, '非同期ジェネレータ')}

    static isDisposableStack(v) {return this.#isIns(v, DisposableStack)}
    static isAsyncDisposableStack(v) {return this.#isIns(v, AsyncDisposableStack)}
    static isReflect(v) {return this.#isIns(v, Reflect)}
    static isProxy(v) {return this.#isIns(v, Proxy)}
    static isIntl(v) {return this.#isIns(v, Intl)}
    static isIntlCollator(v) {return this.#isIns(v, Intl.Collator)}
    static isIntlDateTimeFormat(v) {return this.#isIns(v, Intl.DateTimeFormat)}
    static isIntlDisplayNames(v) {return this.#isIns(v, Intl.DisplayNames)}
    static isIntlDurationFormat(v) {return this.#isIns(v, Intl.DurationFormat)}
    static isIntlListFormat(v) {return this.#isIns(v, Intl.ListFormat)}
    static isIntlLocale(v) {return this.#isIns(v, Intl.Locale)}
    static isIntlNumberFormat(v) {return this.#isIns(v, Intl.NumberFormat)}
    static isIntlPluralRules(v) {return this.#isIns(v, Intl.PluralRules)}
    static isIntlRelativeTimeFormat(v) {return this.#isIns(v, Intl.RelativeTimeFormat)}
    static isIntlSegmenter(v) {return this.#isIns(v, Intl.Segmenter)}

    static isWindow(v) {this.#isIns(v, Window)}
    static isDocument(v) {this.#isIns(v, Document)}
    static isNode(v) {this.#isIns(v, Node)}
    static isElement(v) {this.#isIns(v, Element)}
    static isHTMLElement(v) {this.#isIns(v, HTMLElement)}
    static isSVGElement(v) {this.#isIns(v, SVGElement)}

    static is(v) {return this.#isIns(v, )}
    static is(v) {return this.#isIns(v, )}
    static is(v) {return this.#isIns(v, )}
    static is(v) {return this.#isIns(v, )}
    static is(v) {return this.#isIns(v, )}
    static is(v) {return this.#isIns(v, )}
    static is(v) {return this.#isIns(v, )}
    static is(v) {return this.#isIns(v, )}
    static is(v) {return this.#isIns(v, )}
    static is(v) {return this.#isIns(v, )}
    static is(v) {return this.#isIns(v, )}
    static is(v) {return this.#isIns(v, )}
    static is(v) {return this.#isIns(v, )}
    static is(v) {return this.#isIns(v, )}
    static is(v) {return this.#isIns(v, )}
}
