import { Mappings } from '../../src/types/mappings';
import { State } from '../enums/state';

export interface AddressRaw {
    addressLine1: string;
    addressLine2?: string;
    addressLine3?: string;
    suburb: string;
    state: State;
    postCode: number;
    country: string;
}

export interface Address {
    address1: string;
    address2: string;
    address3: string;
    suburb: string;
    state: string;
    postCode: number;
    country: string;
}

export const AddressMappings: Mappings<Address> = {
    address1: 'addressLine1 | address1',
    address2: 'addressLine2 | address2',
    address3: 'addressLine3 | address3',
    suburb: '',
    state: '',
    postCode: '',
    country: '',
};
