// 実行環境
class WorkerJsEnv { // ワーカーJS実行環境(今動いている環境はワーカーか)
    static isDedicated(v = (typeof self !== 'undefined' ? self : null)) { return typeof DedicatedWorkerGlobalScope !== 'undefined' && v instanceof DedicatedWorkerGlobalScope; }
    static isShared(v = (typeof self !== 'undefined' ? self : null)) { return typeof SharedWorkerGlobalScope !== 'undefined' && v instanceof SharedWorkerGlobalScope; }
    static isService(v = (typeof self !== 'undefined' ? self : null)) { return typeof ServiceWorkerGlobalScope !== 'undefined' && v instanceof ServiceWorkerGlobalScope; }
}
class ThreadJsEnv {
    static get isMain() { return !this.isWorker }
    static get isWorker() { return 'Dedicated Shared Service'.split(' ').some(n => this.Worker[`is${n}`]()); }
    static get Worker() { return WorkerJsEnv; }
}
class ScriptJsEnv {
    static get isModule() { try { return !!import.meta; } catch { return false; } }
    static get isClassic() { return !this.isModule }
}
class RuntimeJsEnv {
    static get isBrowser() { return typeof window !== 'undefined' && typeof window.document !== 'undefined'; }
    static get isNode() { return typeof process !== 'undefined' && process.versions != null && process.versions.node != null; }
    static get isDeno() { return typeof Deno !== 'undefined'; }
    static get isBun() { return typeof Bun !== 'undefined'; }
}
class JsEnv { // JS実行環境(今動いている環境の判定)
    static get Runtime() {return RuntimeJsEnv}
    static get Script() {return ScriptJsEnv}
    static get Thread() {return ThreadJsEnv}
}
