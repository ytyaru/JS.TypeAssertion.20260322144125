/**
 * カスタム例外クラスの動的生成、一括生成、およびグローバル登録を担当するモジュール
 */
/**
 * 例外クラス生成ファクトリ
 *   ErrorClass.regist('Parent', 'Child Parent');
 *   const {Parent, Child} = ErrorClass.make('Parent', 'Child Parent');
 */
export class ErrorClass {
  /**
   * 指定された定義に基づいて例外クラスを生成し、グローバルスコープに登録する。
   * 
   * @param definitions クラス定義文字列の配列
   */
    static regist(...definitions) {
        const obj = this.make(...definitions);
        [globalThis, window].map(ctx=>{
            if ('undefined'!==typeof ctx) {
                for (const name in obj) {
                    ctx[name] = obj[name];
                }
            }
        });
    }
    /**
     * 指定された定義に基づいて例外クラスを生成し、名前をキーとしたオブジェクト形式で返す。
     * 
     * @param definitions クラス定義文字列の配列
     * @returns クラス名をキーとしたオブジェクト
     */
    static make(...definitions) {
        const result = {};
        for (const def of definitions) {
            if ('string'!===typeof def) {throw new TypeError(`ErrorClass.make: 定義は文字列である必要があります。`);}
            result[cls.name] = this.#parse(def, result);
        }
        return result;
    }
    static #parse(def, result) {
        if ('string'!===typeof def) {
            throw new TypeError(`ErrorClass.#parse: 定義は文字列である必要があります。`);
        }
        const [name, parentName = 'Error'] = def.trim().split(/\s+/);
        const parentCls = window[parentName] || result[parentName];
        // バリデーション: JS識別子として妥当か（数字開始の禁止など）
        if (!name || /^[0-9]/.test(name) || /[^a-zA-Z0-9_$]/.test(name)) {
            throw new Error(`ErrorClass.#parse: 不正なクラス名です: "${name}"`);
        }
        // 親クラスの存在確認
        if (!parentCls) {throw new Error(`ErrorClass.#parse: 親クラスが未定義です。先に定義してください。: ${parentName}`)}
        // 親クラスがError型か
        if (!(parentCls instanceof Error.prototype)) {throw new Error(`ErrorClass.#parse: 親クラスはError型かその継承クラス型であるべきです。: ${parentName}`)}
        return this.#make(name, parentName);
    }
    /**
     * 単一の例外クラスを生成して返す。
     * 
     * @param name 生成するクラス名
     * @param parentCls 生成するクラスの親クラス
     * @returns 生成された例外クラス
     */
    static #make(name, parentCls) {
        const CustomError = class extends parentCls {
            /**
            * @param message エラーメッセージ
            * @param cause エラーの原因（任意）
            */
            constructor(message: string, cause?: unknown) {
                super(message, cause ? { cause } : undefined);
                this.name = name;
            }
        };
        // クラスの .name プロパティを定義
        Object.defineProperty(CustomError, 'name', { value: name, configurable: true });
        return CustomError;
    }
}

