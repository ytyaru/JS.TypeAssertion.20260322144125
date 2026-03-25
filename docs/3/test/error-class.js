import { expect, test, describe, beforeEach } from "bun:test";
import { ErrorClass } from "../src/js/error-class.js";

describe("ErrorClass", () => {
    test("make: 単一のクラスを生成できる", () => {
        const classes = ErrorClass.make("MyError");
        expect(classes.MyError).toBeDefined();
        const err = new classes.MyError("test message");
        expect(err).toBeInstanceOf(Error);
        expect(err.name).toBe("MyError");
        expect(err.message).toBe("test message");
    });
    test("make: 親子関係のあるクラスを生成できる", () => {
        const classes = ErrorClass.make("Parent", "Child Parent");
        expect(classes.Child.prototype).toBeInstanceOf(classes.Parent);
        
        const childErr = new classes.Child("child error");
        expect(childErr).toBeInstanceOf(classes.Parent);
        expect(childErr).toBeInstanceOf(Error);
    });
    test("regist: グローバルスコープに登録される", () => {
        ErrorClass.regist("GlobalError");
        // @ts-ignore
        expect(globalThis.GlobalError).toBeDefined();
        // @ts-ignore
        const err = new globalThis.GlobalError("msg");
        expect(err.name).toBe("GlobalError");
    });
    test("regist: 登録されたすべてのクラスが正常にインスタンス化できる", () => {
        // 複数のクラスを一度に登録
        ErrorClass.regist("FirstError", "SecondError FirstError");

        // 登録されたすべてのクラスを実際に new する（これでコンストラクタ関数を「実行」させる）
        // @ts-ignore
        const err1 = new globalThis.FirstError("msg1");
        // @ts-ignore
        const err2 = new globalThis.SecondError("msg2");

        expect(err1).toBeInstanceOf(Error);
        expect(err2).toBeInstanceOf(globalThis.FirstError);
    });
    describe("異常系テスト", () => {
        test("不正な名前のクラス指定でエラーを投げる", () => {
            expect(() => ErrorClass.make("1InvalidName")).toThrow("不正なクラス名です");
            expect(() => ErrorClass.make("Invalid-Name")).toThrow("不正なクラス名です");
        });

        test("未定義の親クラスを指定するとエラーを投げる", () => {
            expect(() => ErrorClass.make("Child UnknownParent")).toThrow("親クラスが未定義です");
        });

        test("文字列以外を渡すとTypeErrorを投げる", () => {
            // @ts-ignore
            expect(() => ErrorClass.make(123)).toThrow("定義は文字列である必要があります");
        });
    });
    test("make: cause（原因）を伴う例外を生成できる", () => {
        const classes = ErrorClass.make("CauseError");
        const originalError = new Error("もとのエラー");
        const err = new classes.CauseError("新しいエラー", originalError);
        
        expect(err.cause).toBe(originalError); // これでコンストラクタの中身を確実に通す
    });
    test("make: 同時生成したクラスを親として指定できる", () => {
        // result[parentName] を確実に使うパターン
        const classes = ErrorClass.make("A", "B A", "C B");
        expect(new classes.C("test")).toBeInstanceOf(classes.A);
    });
    test("make: causeなしでインスタンス化できる", () => {
        const classes = ErrorClass.make("NoCauseError");
        const err = new classes.NoCauseError("msg"); // 第2引数なし
        expect(err.cause).toBeUndefined();
    });
    test("make: globalThisに登録済みのカスタムエラーを親にできる", () => {
        ErrorClass.regist("BaseFromGlobal");
        const classes = ErrorClass.make("SubBase BaseFromGlobal");
        // @ts-ignore
        expect(new classes.SubBase("msg")).toBeInstanceOf(globalThis.BaseFromGlobal);
    });
    test("regist: 登録したクラスを実際に throw して catch できる", () => {
        ErrorClass.regist("ThrowError");
        const throwAndCatch = () => {
            // @ts-ignore
            throw new globalThis.ThrowError("panic!");
        };
        expect(throwAndCatch).toThrow(globalThis.ThrowError);
    });
});


