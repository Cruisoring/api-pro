export interface ArrayKeys {
    RootKey: string; // Key to get the source array
    SortKeys?: string; // Key or Keys to sort the elements of source array, use '+' to join keys
    FilterLambda?: string; // If defined, lambda expression to filter the mapped elements
}

//Keep the keys of ArrayKeys interface for later use
export const ArrayKeysTokens: (keyof ArrayKeys)[] = ['RootKey', 'FilterLambda', 'SortKeys'];

export function forArray(arg: any): arg is ArrayKeys {
    const result: boolean = arg && arg.RootKey && typeof arg.RootKey === 'string';
    return result;
}

export type Mappings<T> = { [k in keyof T]: string | Mappings<T[k]> };

export type ArrayMappings<TElement> = Mappings<TElement> & ArrayKeys;
