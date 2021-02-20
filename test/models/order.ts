import { LineItemArrayMappings, LineItem, OrderItemRaw } from './order-item';
import { CustomerRaw, CustomerMappings, Customer } from './customer';
import { SellerRaw, SellerMappings, Seller } from './seller';
import { ArrayMappings, Mappings } from '../../src/types/mappings';
import { TypeHelper } from '../../src/helpers/type-helper';

export interface OrderRaw {
    seller: SellerRaw;
    customer: CustomerRaw;
    datePlaced: string;
    items: OrderItemRaw[];
    cancelled: OrderItemRaw[];
    total: number;
}

export type LegacyOrder = {
    vender: Seller;
    consumer: Customer;
    orderDate: string;
    orderItems: LineItem[];
    cancelled: LineItem[];
    total: number;
};

export const LegacyOrderMappings: Mappings<LegacyOrder> = {
    vender: TypeHelper.withPrefix(SellerMappings, 'seller > '),
    consumer: TypeHelper.withPrefix(CustomerMappings, 'customer > '),
    orderDate: 'datePlaced',
    orderItems: [TypeHelper.updateArrayKeys(LineItemArrayMappings, {RootKey: 'items'})],
    cancelled: [TypeHelper.updateArrayKeys(LineItemArrayMappings, {RootKey: 'cancelled'})],
    total: 'calculateTotal()',
};

export type Order = Seller &
    Customer & {
        date: string;
        items: LineItem[];
        total: number;
        totalGst: number;
    };

export const OrderMappings: Mappings<Order> = {
    ...TypeHelper.withPrefix(SellerMappings, 'seller > '),
    ...TypeHelper.withPrefix(CustomerMappings, 'customer > '),
    date: 'datePlaced',
    items: [LineItemArrayMappings],
    total: 'calculateTotal()',
    totalGst: 'calculateGst()',
};
