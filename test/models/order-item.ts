import { ArrayMappings, Mappings } from '../../src/types/mappings';

export interface ProductRaw {
    title: string;
    price: number;
    kind: string;
    imageUrl?: string;
    description?: string;
    producer?: string;
    note?: string;
    isGstFree?: boolean;
}

export interface OrderItemRaw {
    product: ProductRaw;
    quantity: number;
    totalPrice: number;
}

export interface LineItem {
    name: string;
    unitPrice: number;
    category: string;
    description: string;
    number: number;
    total: number;
    gst: number;
    // totalWithGst: number;
}

export const LineItemArrayMappings: ArrayMappings<LineItem> = {
    RootKey: 'Items & cancelled', // RootKey to specify key of the element array
    SortKeys: 'name | -total', // Sort elements by name first, unitPrice desc next, finally total

    name: 'product > title | name',
    unitPrice: 'product > price',
    category: 'product > kind',
    description: 'product > discription | producer | note',
    number: 'quantity',
    total: 'totalPrice | total',
    gst: 'getProductGst()',
};
