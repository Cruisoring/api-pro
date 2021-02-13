import { ObjectHelper } from '../src/helpers/object-helper';

const customer: any = {
    firstName: 'Tom',
    lastName: 'Visco',
    age: 24,
    address: {
        line1: '12 Albert st',
        suburb: 'Sunny coast',
        postCode: '4123',
        state: 'QLD',
    },
    discount: 0.8,
    credit: 5,
};

const orders: any = [
    { item: 'notebook', qty: 2, price: 2.78, gst: 0.56, totalWithGst: 6.12 },
    { item: 'pencil', qty: 20, price: 0.22, gst: 0.44, totalWithGst: 4.84 },
    { item: 'ruler', qty: 1, price: 1.78, gst: 0.18, totalWithGst: 1.96 },
    { item: 'case', qty: 1, price: 12.78, gst: 1.28, totalWithGst: 14.06 },
];

const cancelled: any = [
    { item: 'notebook', qty: 1, price: 2.78, gst: -0.28, totalWithGst: -3.06 },
    { item: 'pencil', qty: 10, price: 0.22, gst: -0.22, totalWithGst: -2.42 },
];

const rawData = {
    customer: customer,
    purchased: orders,
    cancelled: cancelled,
};

describe('Test sorting', () => {
    test('sort orders by gst', (): void => {
        const sorted = ObjectHelper.asSortedArray(orders, 'GST');
        sorted.reverse();
        const sortedTotals = sorted.map((o) => o.totalWithGst);
        expect(sortedTotals).toEqual([14.06, 6.12, 4.84, 1.96]);
    });
});

describe('Test ObjectHelper', () => {
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

    test('test getValue() with alternative', () => {
        const itemsLength = ObjectHelper.getValue(rawData, 'purchased | cAncelled > length');
        expect(itemsLength).toEqual(6);
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

        const totalAmount = ObjectHelper.getValue(rawData, `purchased | cancelled > total(${discount}, ${credit})`, {
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
