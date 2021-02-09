export interface ArrayKeys {
    RootKey: string; // Key to get the source array
    FilterKey: string | undefined; // If defined, key to filter the elements of source array
    SortKeys: string; // Key or Keys to sort the elements of source array, use '+' to join keys
}

//Keep the keys of ArrayKeys interface for later use
export const ArrayKeysTokens: (keyof ArrayKeys)[] = ['RootKey', 'FilterKey', 'SortKeys'];

export function isOfArray(arg: any): arg is ArrayKeys {
    const result: boolean = arg && arg.RootKey && typeof arg.RootKey === 'string';
    return result;
}

export type Mappings<T> = { [k in keyof T]: string | Mappings<T[k]> };

export type ArrayMappings<TElement> = Mappings<TElement> & ArrayKeys;