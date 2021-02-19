import { DateHelper } from '../src/helpers/date-helper';

describe('test DateHelper', () => {
    it('test isDateString', () => {
        expect(DateHelper.isDateString('1997/02-05')).toBeTruthy();
        expect(DateHelper.isDateString('15/03/2002')).toBeTruthy();
        expect(DateHelper.isDateString('15/03/2020T11:20:33')).toBeFalsy();
    });

    it('test asDate()', () => {
        expect(DateHelper.asDate('1997/02/15T13:14:15Z').toISOString()).toEqual('1997-02-15T03:14:15.000Z');
    });
});
