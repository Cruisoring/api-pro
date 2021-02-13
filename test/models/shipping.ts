import { Address } from "./address";
import { Customer } from "./customer";

export interface Shipping {
    from: string;
    fromAddress?: Address;
    to: Customer;
    carrier?: string;
    note?: string;
}