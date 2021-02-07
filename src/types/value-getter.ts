export type ValueGetter = (source: any, ...args: any[]) => any;

export type NamedValueGetters = {[name: string]: ValueGetter};