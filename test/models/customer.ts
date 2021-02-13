import { Gender } from "../enums/gender";
import { Address } from "./address";

export interface Customer {
    first_name: string;
    last_name?: string;
    age?: number;
    gender: Gender;
    email?: string;
    mobile: string | number;
    workPhone?: string | number;
    homePhone?: string | number;
    homeAddress?: Address;
    workAddress?: Address;
}

