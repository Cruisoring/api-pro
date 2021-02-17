import { LineItemArrayMappings, LineItem, OrderItemRaw } from './order-item';
import { CustomerRaw, CustomerMappings, Customer } from './customer';
import { SellerRaw, SellerMappings, Seller } from './seller';
import { Mappings } from '../../src/types/mappings';
import { TypeHelper } from '../../src/helpers/type-helper';

export interface OrderRaw {
    seller: SellerRaw;
    customer: CustomerRaw;
    datePlaced: string;
    items: OrderItemRaw[];
    total: number;
}

export type Order = Seller & Customer & {
    date: string;
    items: LineItem[];
    // total: number;
}

export const OrderMappings: Mappings<Order> = {
    ...TypeHelper.withPrefix(SellerMappings, 'seller > '),
    ...TypeHelper.withPrefix(CustomerMappings, 'customer > '),
    date: 'datePlaced',
    items: [LineItemArrayMappings],
    // total: '',
};
