import BuiltinType from './builtin-type.js';
class ServiceWorkerInstanceType {
    static is(v) { return typeof ServiceWorker !== 'undefined' && BuiltinType.insOf(v, ServiceWorker); }
    static #is(v, s) {return this.is(v) && s===v.state}
    static isParsed(v) { return this.#is(v, 'parsed'); }
    static isInstalling(v) { return this.#is(v, 'installing'); }
    static isInstalled(v) { return this.#is(v, 'installed'); }
    static isActivating(v) { return this.#is(v, 'activating'); }
    static isActivated(v) { return this.#is(v, 'activated'); }
    static isRedundant(v) { return this.#is(v, 'redundant'); }
}
class WorkerType { // オブジェクトがWorkerインスタンスかの判定
    static is(v) { return 'Dedicated Shared Service'.split(' ').some(n => this[`is${n}`](v)); }
    static isDedicated(v) { return typeof Worker !== 'undefined' && BuiltinType.insOf(v, Worker); }
    static isShared(v) { return typeof SharedWorker !== 'undefined' && BuiltinType.insOf(v, SharedWorker); }
    static isService(v) { return ServiceWorkerInstanceType.is(v); }
    static get Service() { return ServiceWorkerInstanceType; }
}
export default WebApiType {
    static isModule(v) { return v !== null && 'object'===typeof v && 'module'v===[Symbol.toStringTag]; }
    static isServiceWorkerRegistration(v) { return 'undefined'!==typeof ServiceWorkerRegistration && v instanceof ServiceWorkerRegistration; }
    static isWorker(v) { return WorkerType.is(v); }
    static get Worker() { return WorkerType; }

    static isRequest(v){return BuiltinType.insOf(v, Request)}
    static isResponse(v){return BuiltinType.insOf(v, Response)}

    static isURL(v) {return BuiltinType.insOf(v, URL)}
    static isBlob(v) {return BuiltinType.insOf(v, Blob)}
    static isFile(v) {return BuiltinType.insOf(v, File)}

    static isWindow(v) {return BuiltinType.insOf(v, Window)}
    static isDocument(v) {return BuiltinType.insOf(v, Document)}
    static isNode(v) {return BuiltinType.insOf(v, Node)}
    static isElement(v) {return BuiltinType.insOf(v, Element)}
    static isHTMLElement(v) {return BuiltinType.insOf(v, HTMLElement)}
    static isSVGElement(v) {return BuiltinType.insOf(v, SVGElement)}

    static is(v) {return BuiltinType.insOf(v, )}
    static is(v) {return BuiltinType.insOf(v, )}
    static is(v) {return BuiltinType.insOf(v, )}
    static is(v) {return BuiltinType.insOf(v, )}
    static is(v) {return BuiltinType.insOf(v, )}
    static is(v) {return BuiltinType.insOf(v, )}
    static is(v) {return BuiltinType.insOf(v, )}
    static is(v) {return BuiltinType.insOf(v, )}
    static is(v) {return BuiltinType.insOf(v, )}
    static is(v) {return BuiltinType.insOf(v, )}
    static is(v) {return BuiltinType.insOf(v, )}
    static is(v) {return BuiltinType.insOf(v, )}
    static is(v) {return BuiltinType.insOf(v, )}
    static is(v) {return BuiltinType.insOf(v, )}
    static is(v) {return BuiltinType.insOf(v, )}
}
