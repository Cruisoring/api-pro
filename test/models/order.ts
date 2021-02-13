import { Shipping } from './shipping';
import { OrderItem } from './order-item';
import { Customer } from './customer';

export interface Order {
    customer: Customer;
    datePlaced: Date;
    items: OrderItem[];
    total: number;
}
