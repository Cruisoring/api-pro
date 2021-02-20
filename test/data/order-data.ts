import { Gender } from '../enums/gender';
import { State } from '../enums/state';
import { CustomerRaw } from '../models/customer';
import { SellerRaw } from '../models/seller';
import { OrderItemRaw, ProductRaw } from '../models/order-item';

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
