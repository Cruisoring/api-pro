import { GetOptions } from '../types/get-options';
import { AscendingSortIndictor, DescendingSortIndictor } from '../types/mappings';
import { NamedValueGetters, ValueGetter } from '../types/value-getter';
import { DateHelper } from './date-helper';
import { NumberHelper } from './number-helper';
import { ObjectType, TypeHelper } from './type-helper';

export abstract class ObjectHelper {
    public static PropertyNameCaseIgnored = true;
    public static ReturnUndefinedIfMissing = true;
    public static ThrowWhenFailed = false;
    public static FailedMessageHead = 'Failed with: ';
    public static NamedValueGetters: NamedValueGetters = {};
    public static NumberToFixed = true;
    public static DigitsOfNumber = 2;

    public static getDefaultGetOptions(): GetOptions {
        return {
            // try to ignore case of the propertyName if true
            propertyNameCaseIgnored: ObjectHelper.PropertyNameCaseIgnored,
            // undefined is returned if concerned property is missing when it is set to true:
            returnUndefinedIfMissing: ObjectHelper.ReturnUndefinedIfMissing,
            // throw Exception when get value of property failed
            throwWhenFailed: ObjectHelper.ThrowWhenFailed,
            // message head when getting value failed
            failedMessageHead: ObjectHelper.FailedMessageHead,
            // named functions with signature: (source: any, ...args: any[]) => any
            namedValueGetters: ObjectHelper.NamedValueGetters,
            // keep fixed number of digits for any numbers if True
            keepNumberToFixed: ObjectHelper.NumberToFixed,
            // digits of number to keep
            digitsOfNumber: ObjectHelper.DigitsOfNumber,
        };
    }

    public static readonly RootIndicator: string = '$';
    public static readonly PathConnector: string = '>';
    public static readonly FunctionIndicator: string = '()';
    public static readonly AndConnector: string = '&'; // for array composed by all matched elements
    public static readonly OrConnector: string = '|'; // for element matched first with any of the keys in order
    public static readonly Missing: string = 'MISSING';

    public static readonly ArrayIndexRegex: RegExp = /^(?<key>\S+)?\[\s*(?<index>\d+)\s*\]\s*$/;
    public static readonly FunctionArgsRegex: RegExp = /^\s*(?<funcName>\S+)\((?<args>[^)]*)\)\s*$/;

    //#region Sorting relationed functions
    public static asSortedArray(rootArray: any, ...sortKeys: string[]): any[] {
        const elements: any[] = Array.from(rootArray);
        const keys: string[] = sortKeys.map((k) => k.trim());
        const sorted = elements.sort((e1, e2) => ObjectHelper.compareMultiple(e1, e2, ...keys));
        return sorted;
    }

    public static compareMultiple(e1: any, e2: any, ...sortKeys: string[]): number {
        let result = 0;
        let descSorting = false;
        for (const key of sortKeys) {
            descSorting = key.startsWith(DescendingSortIndictor);
            const valueKey = descSorting || key.startsWith(AscendingSortIndictor) ? key.substring(1) : key;
            const keyValue1: any = ObjectHelper.getValue(e1, valueKey);
            const keyValue2: any = ObjectHelper.getValue(e2, valueKey);
            result = ObjectHelper.compare(keyValue1, keyValue2);
            if (result != 0) {
                return descSorting ? -result : result;
            }
        }
        return descSorting ? -result : result;
    }

    public static compare(e1: any, e2: any): number {
        if (e1 == e2) {
            return 0;
        } else if (TypeHelper.objectTypeOf(e1) == ObjectType.Date && TypeHelper.objectTypeOf(e2) == ObjectType.Date) {
            const date1: Date = DateHelper.asDate(e1);
            const date2: Date = DateHelper.asDate(e2);
            const dateDif: number = date1.valueOf() - date2.valueOf();
            return dateDif;
        } else if (
            TypeHelper.objectTypeOf(e1) == ObjectType.Number &&
            TypeHelper.objectTypeOf(e2) == ObjectType.Number
        ) {
            const dif = (e1 as number) - (e2 as number);
            return dif;
        } else {
            return e1 > e2 ? 1 : -1;
        }
    }

    public static compareReverse(e1: any, e2: any): number {
        return -ObjectHelper.compare(e1, e2);
    }
    //#endregion

    public static valuePathsOf(source: any, path = ''): string[] {
        const keys: string[] = [...Object.keys(source)];
        const results: string[] = [];
        for (const key of keys) {
            const value: any = source[key];
            const vPath: string = path == '' ? key : `${path}${ObjectHelper.PathConnector}${key}`;
            if (TypeHelper.isObject(value)) {
                const valueProperties: string[] = ObjectHelper.valuePathsOf(value, vPath);
                results.push(...valueProperties);
            } else {
                results.push(vPath);
            }
        }
        return results;
    }

    public static valueByPropertyIgnoreCase(
        data: any,
        propertyName: string,
        returnUndefinedIfMissing = true,
        throwWhenFailed = true,
        failedMessageHead = '',
    ): any {
        const lowerName: string = propertyName.trim().toLowerCase();
        const matchedProperties: string[] = Object.keys(data).filter((k) => k.toLowerCase() == lowerName);
        if (matchedProperties.length == 0) {
            if (returnUndefinedIfMissing) {
                return undefined;
            } else if (throwWhenFailed) {
                throw TypeError(`Missing property: ${propertyName}`);
            } else {
                return failedMessageHead + propertyName;
            }
        } else if (matchedProperties.length == 1) {
            return data[matchedProperties[0]];
        } else if (throwWhenFailed) {
            throw TypeError(`Ambiguous properties matched: ${matchedProperties.join(', ')}`);
        } else {
            return failedMessageHead + propertyName;
        }
    }

    public static getValueWithOptions(source: any, path: string, options: Partial<GetOptions> = {}): any {
        options.namedValueGetters = {
            ...ObjectHelper.getDefaultGetOptions().namedValueGetters,
            ...options.namedValueGetters,
        };
        const mergedOptions: GetOptions = { ...ObjectHelper.getDefaultGetOptions(), ...options };
        return this.getValue(source, path, mergedOptions);
    }

    public static getValue(
        source: any,
        path: string,
        options: GetOptions | undefined = undefined,
        root: any = source,
    ): any {
        options = options ?? ObjectHelper.getDefaultGetOptions();
        const fragments: string[] = path.split(ObjectHelper.PathConnector).map((f) => f.trim());
        let current: any = source;
        for (const fragment of fragments) {
            try {
                if (current === null) {
                    // stop searching when current is null, return null immediately
                    return current;
                } else if (current[fragment] != undefined) {
                    // can go deeper and set current to that value:
                    current = current[fragment];
                    continue;
                } else if (ObjectHelper.PropertyNameCaseIgnored) {
                    const matchedValue: any = ObjectHelper.valueByPropertyIgnoreCase(
                        current,
                        fragment,
                        options.returnUndefinedIfMissing,
                        options.throwWhenFailed,
                        options.failedMessageHead,
                    );
                    if (matchedValue != undefined) {
                        current = matchedValue;
                        continue;
                    }
                }

                if (fragment.includes(ObjectHelper.AndConnector)) {
                    // Firstly, adding outcomes of alternative paths regardless of leading/ending SPACEs
                    const andKeys: string[] = fragment.split(ObjectHelper.AndConnector).map((a) => a.trim());
                    const allValues: any[] = [];
                    for (const key of andKeys) {
                        const optionValue: any = ObjectHelper.getValue(current, key, options, root);
                        if (optionValue) {
                            if (TypeHelper.isArray(optionValue)) {
                                allValues.push(...optionValue);
                            } else {
                                allValues.push(optionValue);
                            }
                        }
                    }
                    current = allValues;
                } else if (fragment.includes(ObjectHelper.OrConnector)) {
                    // Secondly, accept single matched element denoted by any key regardless of leading/ending SPACEs
                    const orKeys: string[] = fragment.split(ObjectHelper.OrConnector).map((a) => a.trim());
                    let firstMatched: any = undefined;
                    for (const key of orKeys) {
                        const optionValue: any = ObjectHelper.getValue(current, key, options, root);
                        if (optionValue) {
                            firstMatched = optionValue;
                            break;
                        }
                    }
                    current = firstMatched;
                } else if (ObjectHelper.ArrayIndexRegex.test(fragment)) {
                    // Thirdly, handle index based value retrieval
                    const match: RegExpExecArray = ObjectHelper.ArrayIndexRegex.exec(fragment)!;
                    const arrayKey: string = match!.groups!.key;
                    const array: any = arrayKey ? ObjectHelper.getValue(current, arrayKey, options, root) : current;
                    const index: string = match!.groups!.index;
                    current = ObjectHelper.getValue(array, index, options, root);
                } else if (fragment.startsWith(ObjectHelper.RootIndicator)) {
                    // Fourthly, handle absolute path
                    const rootPath: string = path.substring(1);
                    return ObjectHelper.getValue(root, rootPath, options);
                } else if (ObjectHelper.FunctionArgsRegex.test(fragment)) {
                    // Finally, call named function with/without arguments
                    const match: RegExpExecArray = ObjectHelper.FunctionArgsRegex.exec(fragment)!;
                    const funcName: string = match.groups!.funcName;
                    if (funcName in options.namedValueGetters) {
                        try {
                            const getter: ValueGetter = options.namedValueGetters[funcName];
                            const args: string = match.groups!.args;
                            if (args.length != 0) {
                                const actualArgs: any[] = eval(`[${args}]`);
                                current = getter(current, ...actualArgs);
                            } else {
                                current = getter(current);
                            }
                        } catch (ex) {
                            if (options.throwWhenFailed) {
                                throw ex;
                            } else {
                                console.error(`Get ${fragment} of ${path} by calling '${funcName}': ${ex.message}`);
                                return options.failedMessageHead + `${fragment}: ${funcName} throws '${ex.message}'`;
                            }
                        }
                    } else {
                        if (options.throwWhenFailed) {
                            throw TypeError(`No definition of func with name "${funcName}" to retrieve "${fragment}"`);
                        } else {
                            return options.failedMessageHead + `${fragment}: miss definition of function '${funcName}'`;
                        }
                    }
                } else {
                    if (options.returnUndefinedIfMissing) {
                        return undefined;
                    } else if (options.throwWhenFailed) {
                        throw TypeError(`Missing property of ${fragment}`);
                    } else {
                        return options.failedMessageHead + `missing '${fragment}'`;
                    }
                }
            } catch (ex) {
                console.error(`Failed to retrieve value of ${fragment}: ${ex.message}`);
                throw ex;
            }
        }

        // convert the value to unformed format if needed
        if (TypeHelper.objectTypeOf(current) == ObjectType.Number && options.keepNumberToFixed) {
            return NumberHelper.round(current, options.digitsOfNumber);
        } else {
            return current;
        }
    }
}
