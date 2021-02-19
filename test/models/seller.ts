import { TypeHelper } from '../../src/helpers/type-helper';
import { Mappings } from '../../src/types/mappings';
import { AddressRaw, AddressMappings, Address } from './address';

export interface SellerRaw {
    company_name: string;
    manager_name?: string;
    sales_email: string;
    sales?: string | number;
    support?: string | number;
    emergency?: string | number;
    company_address: AddressRaw;
}

export interface Seller {
    company: string;
    manager?: string;
    sales_email: string;
    phones: (string|number)[];
    company_address: Address;
}

export const SellerMappings: Mappings<Seller> = {
    company: 'company_name',
    manager: 'manager_name',
    sales_email: '',
    phones: 'sales & support & emergency',
    company_address: TypeHelper.withPrefix(AddressMappings, 'company_address > '),
};