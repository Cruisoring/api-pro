import { RootArray } from "root-array";

export type ApiMap<T> = { [k in keyof T]: string | ApiMap<T[k]> };

export type ArrayApiMap<TElement> = ApiMap<TElement> & RootArray;