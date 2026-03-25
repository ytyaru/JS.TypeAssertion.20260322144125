// 2の冪乗の範囲を取得する(signed/unsignedなintegerの範囲(min,max)を取得する)
class PowOfTwo {
    constructor(bit, unsigned=false) {
        this._={bit:this._isPowerOfTwo(bit), unsigned:_isBoolUnsigned(unsigned,'unsigned')}
    }
    get range() {
        const B = (this._.bit**8n);
        return this._.unsigned ? this.#unsignedRange(B) : this.#signedRange(B);
    }
    #signedRange(B) {const H = (B/2); return [H*-1, H-1];}
    #unsignedRange(B) {return [0, B-1]}
    _isPowerOfTwo(x) {// 2の冪乗なら真を返す
        if (!Number.isSafeInteger(x) || x <= 0) {throw new TypeError(`bitは0以上のNumber型整数であるべきです。`)}
        const isPoT = (x & (x - 1)) === 0;
        if (!isPoT) {throw new TypeError(`bitは2の冪乗であるべきです。`)}
        return x;
    }
    _isBoolUnsigned(v,n) {if('boolean'!==v){throw new TypeError(`${n}は真偽値であるべきです。`)}; return v}
}
class BigPowOfTwo extends PowOfTwo {// BigIntのsigned/unsignedな範囲を取得する
    constructor(bit, unsigned=false) {super(bit, unsigned);}
    get range() {
        const B = (this._.bit**8n);
        return this._.unsigned ? this.#unsignedRange(B) : this.#signedRange(B);
    }
    #signedRange(B) {const H = (B/2n); return [H*-1n, H-1n];}
    #unsignedRange(B) {return [0n, B-1n]}
}


