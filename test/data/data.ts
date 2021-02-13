const customer: any = {
    firstName: 'Tom',
    lastName: 'Visco',
    age: 24,
    address: {
        line1: '12 Albert st',
        suburb: 'Sunny coast',
        postCode: '4123',
        state: 'QLD',
    },
    discount: 0.8,
    credit: 5,
};

const orders: any = [
    { item: 'notebook', qty: 2, price: 2.78, gst: 0.56, totalWithGst: 6.12, brand: 'swiggle' },
    { item: 'pencil', qty: 20, price: 0.22, gst: 0.44, totalWithGst: 4.84 },
    { item: 'ruler', qty: 1, price: 1.78, gst: 0.18, totalWithGst: 1.96, description: 'nice looking rule' },
    { item: 'case', qty: 1, price: 12.78, gst: 1.28, totalWithGst: 14.06, note: 'limited version' },
];

const cancelled: any = [
    { item: 'notebook', qty: 1, price: 2.78, gst: -0.28, totalWithGst: -3.06, note: 'wrong quantity entered' },
    { item: 'pencil', qty: 10, price: 0.22, gst: -0.22, totalWithGst: -2.42, note: undefined },
];

const rawData = {
    customer: customer,
    purchased: orders,
    cancelled: cancelled,
};

export {customer, orders, cancelled, rawData}