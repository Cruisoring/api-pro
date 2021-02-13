import { DateHelper } from './date-helper';

export enum ObjectType {
    Null = 'Null',
    Undefined = 'Undefined',
    NaN = 'NaN', //Not a Number

    Boolean = 'Boolean',
    Number = 'Number',
    BigInt = 'BigInt',
    String = 'String',

    Date = 'Date',
    Symbol = 'Symbol',

    Function = 'Function',
    Array = 'Array',
    Object = 'Object',
}

export abstract class TypeHelper {
    public static objectTypeOf(data: any): ObjectType {
        if (data === null) return ObjectType.Null;

        switch (typeof data) {
            case 'undefined':
                return ObjectType.Undefined;
            case 'boolean':
                return ObjectType.Boolean;
            case 'number':
                return ObjectType.Number;
            case 'bigint':
                return ObjectType.Boolean;
            case 'symbol':
                return ObjectType.Symbol;
            case 'function':
                return ObjectType.Function;
            case 'string':
                if (data === 'NaN') {
                    return ObjectType.NaN;
                } else if (DateHelper.isDateString(data)) {
                    return ObjectType.Date;
                } else {
                    return ObjectType.String;
                }
            case 'object':
                if (Array.isArray(data)) return ObjectType.Array;
                else if (data instanceof Date) return ObjectType.Date;
                else return ObjectType.Object;
            default:
                throw Error(`Unexpected type of ${typeof data}`);
        }
    }

    public static isObject(data: unknown): boolean {
        return TypeHelper.objectTypeOf(data) === ObjectType.Object;
    }

    public static isArray(data: unknown): boolean {
        return Array.isArray(data);
    }

    public static pick<T, K extends keyof T>(obj: T, ...keys: K[]): Pick<T, K> {
        const copy: Pick<T, K> = keys.reduce((result: any, key: K) => {
            result[key] = obj[key];
            return result;
        }, {});

        return copy;
    }

    public static skip(obj: any, ...keys: string[]): any {
        const remained: string[] = Object.keys(obj).filter((k) => !keys.includes(k));

        return TypeHelper.pick(obj, ...remained);
    }

    public static update<T extends {}>(template: T, updated: Partial<T>): T {
        const copy: T = { ...template, ...updated };
        return copy;
    }

    // public static isEmptyObject(obj: object): boolean {
    //     const keys: any[] = Object.keys(obj);
    //     for (const key of keys) {
    //         if (!this.isEmpty(TypeHelper.getValue(obj, key))) {
    //             return false;
    //         }
    //     }
    //     return true;
    // }

    public static isEmpty(obj: any): boolean {
        switch (TypeHelper.objectTypeOf(obj)) {
            case ObjectType.Date:
                return DateHelper.NullDateStrings.includes(obj);
            case ObjectType.NaN:
            case ObjectType.Null:
            case ObjectType.Undefined:
                return true;
            case ObjectType.Number:
            case ObjectType.BigInt:
                return obj == 0;
            case ObjectType.Boolean:
                return !obj;
            case ObjectType.String:
            case ObjectType.Array:
                return obj.length == 0;
            case ObjectType.Object:
                return Object.keys(obj).length == 0;
            default:
                return false;
        }
    }
}
