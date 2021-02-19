// import { TypeHelper } from '../../src/helpers/type-helper';
// import { Mappings } from '../../src/types/mappings';
// // import { Address, AddressValue } from './address';
// // import { Customer } from './customer';
// // import { Seller, SellerValue } from './seller';

// export interface Shipping {
//     sender: {
//         name: string;
//         phone?: number | string;
//         emai: string;
//         address?: { line1: string; line2: string; suburb: string; postCode: number };
//     };
//     receiver: {
//         name: string;
//         phone: number | string;
//         emai: string;
//         address?: { line1: string; line2: string; suburb: string; postCode: number };
//     };
//     carrier: { name: string; phone: number | string };
//     note?: string;
// }

// export const ShippingMappings: Mappings<Shipping> = {
//     sender: ...TypeHelper.withPrefix(
//         {
//             name: '',
//             phone: '',
//             emai: '',
//             // address: TypeHelper.withPrefix({ line1: '', line2: '', suburb: '', postCode: '' }, 'fromAddress>'),
//         },
//         'from>',
//     ),
//     receiver: ...TypeHelper.withPrefix(
//         {
//             name: 'toName',
//             phone: 'toPhone',
//             emai: 'toEmail',
//             // address: TypeHelper.withPrefix(
//             //     { line1: 'toAddrLine1', line2: 'toAddrLine2', suburb: 'toSuburb', postCode: 'toPostCode' },
//             //     'toAddress>',
//             // ),
//         },
//         'to>',
//     ),
//     carrier: { name: 'carrier>', phone: 'carrier>' },
// };
