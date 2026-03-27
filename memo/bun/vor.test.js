import { expect, test, describe } from "bun:test";
//import { ValidateError, Validator as vor } from "./vor.js";
import {
    ValidateError,
    Validator as vor,
    OfValidator,
    OwnValidator,
    TypeOfValidator,
    ValueOfValidator,
    RangeOfValidator,
    OwnerOwnValidator,
    SelfOwnValidator,
    ProtoOwnValidator,
    ChainOwnValidator,
} from "./vor.js";
const getTag = (v) => Object.prototype.toString.call(v).slice(8, -1);
describe('vor', () => {
    describe('typeOf()', () => {
        test('TypeOfValidator', () => {
            expect(vor.typeOf(1)).toBeInstanceOf(TypeOfValidator);
        });
    })
    describe('typeOf()', () => {
        test('valueOf()', () => {
            expect(vor.valueOf(1)).toBeInstanceOf(ValueOfValidator);
        });
    });
    describe('typeOf()', () => {
        test('rangeOf()', () => {
            expect(vor.rangeOf(1)).toBeInstanceOf(RangeOfValidator);
        });
    });
});

