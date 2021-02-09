import { NamedValueGetters, ValueGetter } from "value-getter";
import { DateHelper } from "./date-helper";
import { ObjectType, TypeHelper } from "./type-helper";

export abstract class ObjectHelper {
    public static PropertyNameCaseIgnored: boolean = true;

    public static readonly RootIndicator: string = '$';
    public static readonly PathConnector: string = '>';
    public static readonly FunctionIndicator: string = '()';
    public static readonly AlternativeConnector: string = '|';
    public static readonly Missing: string = 'MISSING';

    public static readonly ArrayIndexRegex: RegExp = /^(?<key>\S+)\[(?<index>\d+)\]\s*$/;
    public static readonly FunctionArgsRegex: RegExp = /^\s*(?<funcName>\S+)\((?<args>[^)]*)\)\s*$/;

    //#region Sorting relationed functions
    public static asSortedArray(rootArray: any,  ...sortKeys: string[]): any[] {
        const elements: any[] = Array.from(rootArray);
        elements.sort((e1, e2) => ObjectHelper.compareMultiple(e1, e2, ...sortKeys));
        return elements;
    }

    public static compareMultiple(e1: any, e2: any, ...sortKeys: string[]): number {
        let result: number = 0;
        for (const key of sortKeys) {
            const keyValue1: any = ObjectHelper.getValue(e1, key);
            const keyValue2: any = ObjectHelper.getValue(e2, key);
            result = ObjectHelper.compare(keyValue1, keyValue2);
            if (result != 0) {
                return result;
            }
        }
        return result;
    }

    public static compare(e1: any, e2: any): number {
        if (e1 == e2) {
            return 0;}
        else if (TypeHelper.objectTypeOf(e1) == ObjectType.Date && TypeHelper.objectTypeOf(e2) == ObjectType.Date) {
            const date1: Date = DateHelper.asDate(e1);
            const date2: Date = DateHelper.asDate(e2);
            const dateDif: number = date1.valueOf() - date2.valueOf();
            return dateDif;
        } else if (e1 > e2) {
            return 1;
        }
        else {
            return -1;
        }
    }

    public static compareReverse(e1: any, e2: any): number {
        return -ObjectHelper.compare(e1, e2);
    }
    //#endregion

    public static valuePathsOf(source: any, path: string = ''): string[] {
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

    public static valueByPropertyIgnoreCase(data: any, propertyName: string): any {
        const lowerName: string = propertyName.trim().toLowerCase();
        const matchedProperties: string[] = Object.keys(data).filter(k => k.toLowerCase() == lowerName);
        if (matchedProperties.length == 0) return undefined;
        else if (matchedProperties.length == 1) return data[matchedProperties[0]];
        else throw TypeError(`Ambiguous properties matched: ${matchedProperties.join(', ')}`);
    }

    // TODO: split to caseInsensitive version
    public static getValue(source: any, path: string, namedGetter: NamedValueGetters = {}, root: any = source): any {
        const fragments: string[] = path.split(ObjectHelper.PathConnector).map(f => f.trim());
        let current: any = source;
        for (const fragment of fragments ) {
            try {
                if (current === null) {
                    // stop searching when current is null, return null immediately
                    return current;
                } else if (current[fragment] != undefined) {
                    // can go deeper and set current to that value:
                    current = current[fragment];
                    continue;                 
                } else if (ObjectHelper.PropertyNameCaseIgnored) {
                    const matchedValue: any = ObjectHelper.valueByPropertyIgnoreCase(current, fragment);
                    if (matchedValue != undefined) {
                        current = matchedValue;
                        continue;
                    }
                }
                
                if (fragment.includes(ObjectHelper.AlternativeConnector)) {
                    // First, accept alternative paths with leading/ending SPACEs
                    const alterKeys: string[] = fragment.split(ObjectHelper.AlternativeConnector).map((a) => a.trim());
                    const allValues: any[] = [];
                    for (const key of alterKeys) {
                        const optionValue: any = ObjectHelper.getValue(current, key, namedGetter, root);
                        allValues.push(...optionValue);
                    }
                    current = allValues;
                } else if (ObjectHelper.ArrayIndexRegex.test(fragment)) {
                    // Second, handle index based value retrieval
                    const match: RegExpExecArray = ObjectHelper.ArrayIndexRegex.exec(fragment)!;
                    const arrayKey: string = match!.groups!.key;
                    const array: any = ObjectHelper.getValue(current, arrayKey, namedGetter, root);
                    const index: string = match!.groups!.index;
                    current = ObjectHelper.getValue(array, index, namedGetter, root);
                } else if (fragment.startsWith(ObjectHelper.RootIndicator)) {
                    // Third, handle absolute path
                    const rootPath: string = path.substring(1);
                    return ObjectHelper.getValue(root, rootPath, namedGetter);
                } else if (ObjectHelper.FunctionArgsRegex.test(fragment)) {
                    // Finally, call named function with/without arguments
                    const match: RegExpExecArray = ObjectHelper.FunctionArgsRegex.exec(fragment)!;
                    const funcName: string = match.groups!.funcName;
                    if (funcName in namedGetter) {
                        try {
                            const getter: ValueGetter = namedGetter[funcName];
                            const args: string = match.groups!.args;
                            if (args.length != 0) {
                                const actualArgs: any[] = eval(`[${args}]`);
                                current = getter(current, ...actualArgs);
                            } else {
                                current = getter(current);
                            }                            
                        } catch (ex) {
                            console.error(`Get ${fragment} of ${path} by calling '${funcName}': ${ex.message}`);
                            throw ex;
                        }
                    } else {
                        throw TypeError(`No definition of func with name "${funcName}" to retrieve "${fragment}"`);
                    }
                } else {
                    return undefined;
                }
            } catch (ex) {
                console.error(`Failed to retrieve value of ${fragment}: ${ex.message}`);
                throw ex;
            }


        }
        return current;
    }


}