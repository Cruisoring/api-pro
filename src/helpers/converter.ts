import { ArrayKeysTokens, ArrayMappings, Mappings } from 'mappings';
import { ObjectHelper } from './object-helper';
import { TypeHelper } from './type-helper';

export class Converter<T> {
    // TODO: with control options as Map<string, any>?
    constructor(private mappings: Mappings<T>) {}

    public convert(source: any): T {
        const result = Converter.convert(source, this.mappings);
        return result;
    }

    public static convert<T>(source: any, mappings: Mappings<T>, root: any = source): T {
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
                    // use property if mapping is empty
                    const actualMapping: string = mapping ?? property;
                    if (TypeHelper.isArray(source)) {
                        const arr: any[] = source as [];
                        const dataValues: any[] = arr.map((d) => ObjectHelper.getValue(d, actualMapping, root));
                        result[key] = dataValues as any;
                    } else {
                        const dataValue: any = ObjectHelper.getValue(source, actualMapping, root);
                        result[key] = dataValue;
                    }
                } else if (TypeHelper.isArray(mapping)) {
                    // convert when the child is of Array
                    // let it throw Exception if the mapping is empty
                    const arrayMap: ArrayMappings<any> = (mapping as any)[0] as ArrayMappings<any>;
                    const rootArray: any = ObjectHelper.getValue(source, String(arrayMap.RootPath));
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
                            Converter.convert(e, elemMappings, root),
                        );

                        // filter if FilterKey can be evaluated as a lambda
                        let filteredElements: any = mappedElements;
                        if (arrayMap.FilterKey) {
                            const filter: (x: any) => boolean = eval(arrayMap.FilterKey);
                            filteredElements = (mappedElements as any).filter(filter);
                        }

                        // then sort the maped items with the shared keys
                        const sortedElements: unknown = ObjectHelper.asSortedArray(
                            filteredElements,
                            ...arrayMap.SortKeys.split(',').map((k) => k.trim()),
                        );
                        result[key] = sortedElements as T[typeof key];
                    }
                } else {
                    // convert when the child is of complex object
                    result[key] = this.convert(source, mapping as Mappings<T[typeof key]>, root);
                }
            } catch (ex) {
                console.error(`With property '${property}': ${ex.message}`);
                throw ex;
            }
        }

        return result;
    }
}
