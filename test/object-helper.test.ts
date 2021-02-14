import { ObjectHelper } from '../src/helpers/object-helper';
import {customer, orders, cancelled, rawData} from './data/data';

describe('Test sorting', () => {
    test('sort orders by gst', (): void => {
        const sorted = ObjectHelper.asSortedArray(orders, 'GST');
        sorted.reverse();
        const sortedTotals = sorted.map((o) => o.totalWithGst);
        expect(sortedTotals).toEqual([14.06, 6.12, 4.84, 1.96]);
    });

    const items = [...cancelled, ...orders];
    test('sort by date then item', () => {
        const sorted = ObjectHelper.asSortedArray(items, 'Date', 'Item');
        const sortedTotals = sorted.map((i) => i.totalWithGst);
        expect(sortedTotals).toEqual([14.06, 4.84, 1.96, -2.42, 6.12, -3.06]);
    });

    test('sort by date then item descending', () => {
        const sorted = ObjectHelper.asSortedArray(items, '+Date', '-Item');
        const sortedTotals = sorted.map((i) => i.totalWithGst);
        expect(sortedTotals).toEqual([1.96, 4.84, 14.06, -2.42, 6.12, -3.06]);
    });
});

describe('Test ObjectHelper with default configs', () => {
    test('test valueByPropertyIgnoreCase() with spaces in the paths', () => {
        const address = ObjectHelper.valueByPropertyIgnoreCase(customer, ' addreSS ');
        expect(address.state).toEqual('QLD');
    });

    test('test valueByPropertyIgnoreCase() throws with ambiguity', () => {
        const ambiguity = { name: 'tom', NAME: 'TOM', Name: 'Tom' };
        const Tom = ObjectHelper.getValue(ambiguity, ' Name ');
        expect(Tom).toEqual('Tom');
        const t = () => ObjectHelper.valueByPropertyIgnoreCase(ambiguity, 'NaME');
        expect(t).toThrow('Ambiguous properties matched: name, NAME, Name');
    });

    test('test valuePathsOf()', () => {
        const paths: string[] = ObjectHelper.valuePathsOf(customer);
        console.log(JSON.stringify(paths));
    });

    test('test getValue() with simple path', () => {
        const state = ObjectHelper.getValue(customer, 'Address>state');
        expect(state).toEqual('QLD');
    });

    test('test getValue() with array', () => {
        const price = ObjectHelper.getValue(rawData, 'PURCHASED[2]>Price');
        expect(price).toEqual(1.78);

        const gst = ObjectHelper.getValue(cancelled, '[1] > GST');
        expect(gst).toEqual(-0.22);
    });

    test('test getValue() with andConnector', () => {
        const itemsLength = ObjectHelper.getValue(rawData, 'purchased & cAncelled > length');
        expect(itemsLength).toEqual(6);
    });

    test('test getValue() with orConnector', () => {
        const data = {item: 'apple', description: 'red big', note: '$1.1/per'}
        let info = ObjectHelper.getValue(data, 'info | DESC | Description | note');
        expect(info).toEqual('red big');
        info = ObjectHelper.getValue(data, ' infomation | DESC ');
        expect(info).toBeUndefined;
    });

    test('test getValue() with both AndConnector Ond orConnector', () => {
        let info = ObjectHelper.getValue(rawData, 'purchased & cAncelled > [2]> info | DESC | Description | note');
        expect(info).toEqual('nice looking ruler');
        info = ObjectHelper.getValue(rawData, 'purchased & cAncelled > [4]> info | DESC |NOTE | item');
        expect(info).toEqual('wrong quantity entered');
    });

    test('test getValue() with missing property', () => {
        let missing = ObjectHelper.getValue(rawData, 'noSuchField');
        expect(missing).toEqual(undefined);
        missing = ObjectHelper.getValue(rawData, 'purchased > date');
        expect(missing).toEqual(undefined);
        missing = ObjectHelper.getValue(rawData, 'purchased [5]');
        expect(missing).toEqual(undefined);
    });

    test('test getValue() with named function', () => {
        const discount: number = ObjectHelper.getValue(rawData, 'customer>discount');
        const credit: number = ObjectHelper.getValue(rawData, 'customer>credit') ?? 0;
        const getters = {
            //function to sum totalWithGst then multiple discount in percentages then minus credit
            total: (items: any[], disc: any, credit: any) =>
                items.reduce((total, item) => total + item.totalWithGst, 0) * disc - credit,
        };

        const totalAmount = ObjectHelper.getValueWithOptions(rawData, `purchased & cancelled > total(${discount}, ${credit})`, {
            namedValueGetters: getters,
        });
        expect(totalAmount.toFixed(2)).toEqual('12.20');
    });
});

describe('Test ObjectHelper with ThrowWhenMappingFailed set to FALSE', () => {
    test('valueByPropertyIgnoreCase() returns message when property missing', () => {
        const gender = ObjectHelper.valueByPropertyIgnoreCase(customer, 'gender', false, false);
        expect(typeof gender == 'string').toBeTruthy();
    });
});
