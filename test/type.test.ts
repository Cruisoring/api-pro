import { TypeHelper } from "../src/helpers/type-helper";
import { LineItemArrayMappings } from "./models/order-item";
import { SellerMappings } from "./models/seller";

describe('tests of TypeHelper', () => {
    it('test pick', () => {
        const rawData = {key1: 123, key2: 456, key3: 'abc'};
        const picked = TypeHelper.pick(rawData, 'key1', 'key3');
        expect(picked).toEqual({key1: 123, key3: 'abc'});
    });

    it('test skip', () => {
        const rawData = {key1: 123, key2: 456, key3: 'abc'};
        const skipped = TypeHelper.skip(rawData, 'key1', 'key3');
        expect(skipped).toEqual({ key2: 456});
    });

    it('test update()', () => {
        const rawData = {key1: 123, key2: 456, key3: 'abc'};
        const updated = TypeHelper.update(rawData, { key1: 321, key3: undefined });
        expect(updated).toEqual({ key1: 321, key2: 456, key3: undefined });
    });

    it('test withPrfix()', () => {
        const prefixed = TypeHelper.withPrefix({abn: 'ABN', phone: "contactUs"}, 'seller>');
        expect(prefixed).toEqual({ abn: 'seller>ABN', phone: 'seller>contactUs' });

        const arrayPrefixed = TypeHelper.withPrefix(
            {RootKey: 'items', SortKeys: 'name|-price|qty', name:'', price: 'unitPrice', qty:'quantity', note: 'note'}, 'order>products');
        expect(arrayPrefixed).toEqual({
            RootKey: 'order>products>',
            SortKeys: 'name|-price|qty',
            name: '',
            price: 'unitPrice',
            qty: 'quantity',
            note: 'note',
        });
    });
});