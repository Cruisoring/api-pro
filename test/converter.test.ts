import { ArrayMappings, Mappings } from '../src/types/mappings';
import { Converter } from '../src/helpers/converter';
import { customer, orders, cancelled, rawData } from './data/data';

interface profile {
    givenName: string;
    lastName: string;
    line1: string;
}

const profileMappings: Mappings<profile> = {
    givenName: 'FirstName', // mapping key could be case-insensitive by default
    lastName: '', // emtpy mapping key would be replaced by the property name
    line1: 'address > ', // simple property of property with line1 replacing last empty mapping
};

interface product {
    name: string;
    brand?: string;
    desc?: string;
}

interface items {
    items: product[];
}

const itemArrayMappings: ArrayMappings<product> = {
    RootKey: 'purchased & cancelled',
    SortKeys: 'name', // Use the names of the mapped elements for sorting
    // FilterLambda: '',

    name: 'item',
    desc: 'description | note | brand | item',
};

const itemsMappings: Mappings<items> = {
    items: [itemArrayMappings],
};

interface amount {
    unitPrice: number;
    qty: number;
    gst: number;
    // totalExclGst: number;
    totalInclGst?: number;
}

const amountMappings: Mappings<amount> = {
    unitPrice: 'Price',
    qty: '',
    gst: '',
    totalInclGst: '',
    // totalWithoutGst = 'totalWithoutGst()',
};

// interface transaction {
//     customer: profile;
//     transactions:
// }

describe('Converter test', () => {
    test('test convert() with simplest mappings', () => {
        const converter = new Converter(profileMappings);
        const profile = converter.convert(customer);
        const expected = { givenName: 'Tom', lastName: 'Visco', line1: '12 Albert st' };
        expect(profile).toEqual(expected);
    });

    test('test convert() with array', () => {
        const converter = new Converter(itemsMappings);
        const products = converter.convert(rawData);
        console.log(JSON.stringify(products));
        expect(products.items.map((p) => p.desc)).toEqual([
            'limited version',
            'swiggle',
            'wrong quantity entered',
            'banana',
            'pencil',
            'nice looking ruler',
        ]);
    });

    // test('test convert() with array filter', () => {
    //     const converter = new Converter(itemsMappings);
    //     const products = converter.convert(rawData);
    //     console.log(JSON.stringify(products));
    //     expect(products.items.map((p) => p.desc)).toEqual([
    //         'limited version',
    //         'swiggle',
    //         'wrong quantity entered',
    //         'banana',
    //         'pencil',
    //         'nice looking ruler',
    //     ]);        
    // })
});
