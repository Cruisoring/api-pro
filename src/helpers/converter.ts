import { GetOptions } from '../types/get-options';
import { ArrayKeysTokens, ArrayMappings, Mappings, SortKeySeparator } from '../types/mappings';
import { ObjectHelper } from './object-helper';
import { TypeHelper } from './type-helper';

export class Converter<T> {
    readonly options: GetOptions;
    readonly mappings: Mappings<T>;

    constructor(mappings: Mappings<T>, options: Partial<GetOptions> = {}) {
        options.namedValueGetters = {
            ...ObjectHelper.getDefaultGetOptions().namedValueGetters,
            ...options.namedValueGetters,
        };
        this.options = { ...ObjectHelper.getDefaultGetOptions(), ...options };
        this.mappings = mappings;
    }

    public convert(source: any): T {
        const result = Converter.convert(source, this.mappings, this.options);
        return result;
    }

    public static convert<T>(source: any, mappings: Mappings<T>, options: GetOptions, root: any = source): T {
        if (source === null || undefined) {
            throw new TypeError(`Cannot extract values from null or undefined`);
        }

        const result: T = {} as T;
        const keys: string[] = Object.keys(mappings);
        for (const property of keys) {
            const key: keyof T = property as keyof T;
            try {
                const mapping: string | Mappings<T[typeof key]> = mappings[key];
                if (typeof mapping === 'string') {
                    const trimmed = mapping.trim();
                    // use property if mapping is empty or ended with ObjectHelper.PathConnector
                    const actualMapping: string =
                        mapping.length == 0 || trimmed.endsWith(ObjectHelper.PathConnector)
                            ? trimmed + property
                            : mapping;
                    if (TypeHelper.isArray(source)) {
                        const arr: any[] = source as [];
                        const dataValues: any[] = arr.map((d) =>
                            ObjectHelper.getValue(d, actualMapping, options, root),
                        );
                        result[key] = dataValues as any;
                    } else {
                        const dataValue: any = ObjectHelper.getValue(source, actualMapping, options, root);
                        result[key] = dataValue;
                    }
                } else if (TypeHelper.isArray(mapping)) {
                    // convert when the child is of Array
                    // let it throw Exception if the mapping is empty
                    const arrayMap: ArrayMappings<any> = (mapping as any)[0] as ArrayMappings<any>;
                    const rootArray: any = ObjectHelper.getValue(source, String(arrayMap.RootKey), options, root);
                    if (!TypeHelper.isArray(rootArray)) {
                        throw new TypeError(`The root element of '${arrayMap.RootPath}' must be an array.`);
                    } else if (rootArray.length == 0) {
                        result[key] = ([] as unknown) as T[typeof key];
                    } else {
                        // skip keys of ArrayKeys to get Mappsings of elements
                        const elemMappings: Mappings<any> = TypeHelper.skip(
                            arrayMap,
                            ...ArrayKeysTokens,
                        ) as Mappings<any>;

                        // use it to get all elements
                        const mappedElements: unknown = rootArray.map((e: any) =>
                            Converter.convert(e, elemMappings, options, root),
                        );

                        // filter if FilterKey can be evaluated as a lambda
                        let filteredElements: any = mappedElements;
                        if (arrayMap.FilterLambda) {
                            const filter: (x: any) => boolean = eval(arrayMap.FilterLambda);
                            filteredElements = (mappedElements as any).filter(filter);
                        }

                        // then sort the maped items with the shared keys if specified
                        if (!arrayMap.SortKeys || arrayMap.SortKeys.trim().length > 0) {
                            const sortKeys = arrayMap.SortKeys!.split(SortKeySeparator).map((k) => k.trim());
                            const sortedElements: unknown = ObjectHelper.asSortedArray(filteredElements, ...sortKeys);
                            result[key] = sortedElements as T[typeof key];
                        } else {
                            result[key] = filteredElements;
                        }
                    }
                } else {
                    // convert when the child is of complex object
                    const child = source[key] ?? source;
                    result[key] = this.convert(child, mapping as Mappings<T[typeof key]>, options, root);
                }
            } catch (ex) {
                console.error(`With property '${property}': ${ex.message}`);
                throw ex;
            }
        }

        return result;
    }
}
