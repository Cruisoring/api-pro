import { Converter } from '../src/helpers/converter';
import {
    OrderRaw,
    Order,
    OrderMappings,
    LegacyOrderMappings as LegacyOrderMappings,
    LegacyOrder as LegacyOrder,
} from './models/order';
import {} from './data/order-data';
import { Gender } from './enums/gender';
import { State } from './enums/state';
import { CustomerRaw } from './models/customer';
import { ProductRaw, OrderItemRaw } from './models/order-item';
import { SellerRaw } from './models/seller';
import { FileHelper } from '../src/helpers/file-helper';

//#region raw order data
const customers: CustomerRaw[] = [
    {
        first_name: 'Tom',
        last_name: 'Wilson',
        age: 23,
        gender: Gender.Male,
        email: 'tom@gmail.com',
        mobile: '0432883092',
        address: {
            addressLine1: '12 Bluelake St',
            suburb: 'Roseberry',
            state: State.QLD,
            postCode: 4023,
            country: 'Australia',
        },
    },
    {
        first_name: 'Alice',
        last_name: 'Blare',
        age: 27,
        gender: Gender.Female,
        email: 'alice@gmail.com',
        mobile: '0722883092',
        address: {
            addressLine1: '55 Tooray St',
            suburb: 'Clark',
            state: State.QLD,
            postCode: 4033,
            country: 'Australia',
        },
    },
];

const companies: SellerRaw[] = [
    {
        company_name: 'Abc company',
        manager_name: 'Clark Dell',
        sales_email: 'abc@email.com',
        sales: '14ABCD',
        support: 123456,
        company_address: {
            addressLine1: '123 Grand St',
            suburb: 'Brisbane',
            state: State.QLD,
            postCode: 4000,
            country: 'Australia',
        },
    },
    {
        company_name: 'Xyz company',
        manager_name: 'Philip Carter',
        sales_email: 'xyz@email.com',
        sales: '14XYZX',
        emergency: 128802,
        company_address: {
            addressLine1: '456 Grand St',
            suburb: 'Melbourne',
            state: State.VIC,
            postCode: 3000,
            country: 'Australia',
        },
    },
];

const products: ProductRaw[] = [
    {
        title: 'apple',
        price: 1.2,
        kind: 'Veg',
        description: 'big red',
        producer: 'appFarm',
        note: 'low stock',
        isGstFree: false,
    },
    { title: 'banana', price: 2.99, kind: 'Veg', producer: 'appFarm', note: 'yummy', isGstFree: false },
    { title: 'milk', price: 4, kind: 'Dairy', description: '3L', isGstFree: true },
    { title: 'juice', price: 5.2, kind: 'Drink', description: 'orange', producer: 'Juicer', isGstFree: false },
    { title: 'cookie', price: 3.49, kind: 'Food', isGstFree: false },
    { title: 'bread', price: 2.9, kind: 'Food', description: 'with nuts', isGstFree: false },
];

const orderedItems: OrderItemRaw[] = [
    { product: products[0], quantity: 2, totalPrice: 2.4 },
    { product: products[1], quantity: 1, totalPrice: 2.99 },
    { product: products[2], quantity: 3, totalPrice: 12 },
    { product: products[3], quantity: 1, totalPrice: 5.2 },
    { product: products[4], quantity: 2, totalPrice: 6.98 },
    { product: products[5], quantity: 3, totalPrice: 8.7 },
];

const cancelledItems: OrderItemRaw[] = [
    { product: products[0], quantity: -1, totalPrice: -1.2 },
    { product: products[1], quantity: -1, totalPrice: -2.99 },
    { product: products[2], quantity: -2, totalPrice: -8 },
    { product: products[5], quantity: -1, totalPrice: -2.9 },
];

const rawOrder: OrderRaw = {
    seller: companies[0],
    customer: customers[0],
    datePlaced: '2021-02-15',
    items: orderedItems,
    cancelled: cancelledItems,
    total: 38.27,
};
//#endregion

describe('test converter with mock order data', () => {
    test('print LegacyOrderMappings', () => {
        // console.dir(JSON.stringify(LegacyOrderMappings, null, 4));
        FileHelper.saveText('LegacyOrderMappings.json', LegacyOrderMappings);
    });

    test('test convert with LegacyOderMappings', () => {
        const converter: Converter<LegacyOrder> = new Converter(LegacyOrderMappings, {
            namedValueGetters: {
                getProductGst: (item: any) => 
                    item.product.isGstFree ? 0 : item.totalPrice * 0.1,
                calculateTotal: (order: any) =>
                    [...order.items, ...order.cancelled].map((item) => item.totalPrice).reduce((sm, p) => sm + p, 0),
            },
        });
        const orderConverted = converter.convert(rawOrder);
        // console.dir(JSON.stringify(orderConverted, null, 4));
        FileHelper.saveText('LegacyOrder.json', orderConverted);
    });

    test('print OrderMappings', () => {
        // console.dir(JSON.stringify(OrderMappings, null, 4));
        FileHelper.saveText('NewOrderMappings.json', OrderMappings);
    });

    test('test convert tiwh OderMappings', () => {
        const converter: Converter<Order> = new Converter(OrderMappings, {
            namedValueGetters: {
                getProductGst: (item: any) => (item.product.isGstFree ? 0 : item.totalPrice * 0.1),
                calculateTotal: (order: any) =>
                    [...order.items, ...order.cancelled].map((p) => p.totalPrice).reduce((sm, p) => sm + p, 0),
                calculateGst: (order: any) =>
                    [...order.items, ...order.cancelled]
                        .map((p) => (p.product.isGstFree ? 0 : p.totalPrice * 0.1))
                        .reduce((sm, p) => sm + p, 0),
            },
        });
        const orderConverted = converter.convert(rawOrder);
        // console.dir(JSON.stringify(orderConverted, null, 4));
        FileHelper.saveText('NewOrder.json', orderConverted);
    });
});
