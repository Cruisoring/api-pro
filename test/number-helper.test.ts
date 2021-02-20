import { NumberHelper } from '../src/helpers/number-helper';

describe('test NumberHelper', () => {
    it('test getFactorOfDigits()', () => {
        expect(NumberHelper.getFactorOfDigits(0)).toEqual(1);
        expect(NumberHelper.getFactorOfDigits(1)).toEqual(10);
        expect(NumberHelper.getFactorOfDigits(-1)).toEqual(0.1);
        expect(NumberHelper.getFactorOfDigits(5)).toEqual(100000);
        expect(NumberHelper.getFactorOfDigits(-5)).toEqual(0.00001);
        expect(NumberHelper.getFactorOfDigits(10)).toEqual(10000000000);
        expect(NumberHelper.getFactorOfDigits(-10)).toEqual(0.0000000001);
    });

    test('test round() by default digits of 5', () => {
        expect(NumberHelper.round(0)).toEqual(0);
        expect(NumberHelper.round(10.002, undefined)).toEqual(10.002);
        expect(NumberHelper.round(-10.23323)).toEqual(-10.23323);
        expect(NumberHelper.round(-10.233233)).toEqual(-10.23323);
        expect(NumberHelper.round(-10.233237, undefined)).toEqual(-10.23324);
        expect(NumberHelper.round(0.2332323)).toEqual(0.23323);
    });

    test('test round() by digits specified', () => {
        expect(NumberHelper.round(0, 10)).toEqual(0);
        expect(NumberHelper.round(10.002, 3)).toEqual(10.002);
        expect(NumberHelper.round(10.002, 2)).toEqual(10);
        expect(NumberHelper.round(-10.23323, -1)).toEqual(-10);
        expect(NumberHelper.round(-10.23323377, 7)).toEqual(-10.2332338);
        expect(NumberHelper.round(-10.253237, 1)).toEqual(-10.3);
        expect(NumberHelper.round(0.2332323, 5)).toEqual(0.23323);
    });
});
