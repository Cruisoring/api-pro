import { Product } from "./product";

export class ShoppingCartItem {
    itemId: string;
    title: string;
    price: number;
    imageUrl: string;
    quantity: number;
    /* Partial is a built in TypeScript class. Partial means we can pass in an object that
        LOOKS like a ShoppingCartItem type.
    */
    constructor(init?: Partial<ShoppingCartItem>) {
        Object.assign(this, init);//copy everything from init into this instance of ShoppingCartItem.
    }

    //get price based on quantity and price per item.
    getTotalPrice(): number {
        return this.price * this.quantity;
    }
}