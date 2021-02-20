export interface ValueFormatter {
     (value: any, ...args: any[]) : any;
}

export type TypedValueFormatters = { [valueType: string]: ValueFormatter };
