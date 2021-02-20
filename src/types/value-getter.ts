export type ValueGetter = (source: any, root: any, ...args: any[]) => any;

export type NamedValueGetters = { [name: string]: ValueGetter };
