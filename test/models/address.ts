import { State } from '../enums/state';

export interface Address {
    addressLine1: string;
    addressLine2?: string;
    addressLine3?: string;
    suburb: string;
    state: State;
    postCode: number;
    country: string;
}
