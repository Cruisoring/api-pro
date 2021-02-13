import { NamedValueGetters } from "value-getter";

export interface GetOptions {
    // try to ignore case of the propertyName if true
    propertyNameCaseIgnored: boolean;
    // undefined is returned if concerned property is missing when it is set to true:
    returnUndefinedIfMissing: boolean;
    // throw Exception when get value of property failed
    throwWhenFailed: boolean;
    // message head when getting value failed
    failedMessageHead: string;
    // named functions with signature: (source: any, ...args: any[]) => any
    namedValueGetters: NamedValueGetters;
}