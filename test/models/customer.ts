import { TypeHelper } from '../../src/helpers/type-helper';
import { Mappings } from '../../src/types/mappings';
import { Gender } from '../enums/gender';
import { AddressRaw, AddressMappings, Address } from './address';

export interface CustomerRaw {
    first_name: string;
    last_name?: string;
    age?: number;
    gender: Gender;
    email?: string;
    mobile: string | number;
    workPhone?: string | number;
    homePhone?: string | number;
    address?: AddressRaw;
}

export interface Customer {
    firstName: string;
    lastName: string;
    age: number;
    gender: string;
    email: string;
    phone: string | number;
    address: Address;
}

export const CustomerMappings: Mappings<Customer> = {
    firstName: 'first_name',
    lastName: 'last_name',
    age: '',
    gender: '',
    email: '',
    phone: 'mobile | workphone | homephone',
    address: TypeHelper.withPrefix(AddressMappings, 'address >'),
}
