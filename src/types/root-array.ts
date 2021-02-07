export interface RootArray {
    RootKey: string; // Key to get the source array
    FilterKey: string | undefined; // If defined, key to filter the elements of source array
    SortKeys: string; // Key or Keys to sort the elements of source array, use '+' to join keys
}

export function isRootArray(arg: any): arg is RootArray {
    const result: boolean = arg && arg.RootKey && typeof arg.RootKey === 'string';
    return result;
}