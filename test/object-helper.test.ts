import {ObjectHelper} from '../src/helpers/object-helper'

describe('Test ObjectHelper', () => {
    const customer: any = {
        firstName: 'Tom',
        lastName: 'Visco',
        age: 24,
        address: {
            line1: '12 Albert st',
            suburb: 'Sunny coast',
            postCode: '4123',
            state: 'QLD'
        }
    };

    test('test valuePathsOf()', () => {
        const paths: string[] = ObjectHelper.valuePathsOf(customer);
        console.log(JSON.stringify(paths));
    });

    test('test getValue()', () => {
        const state = ObjectHelper.getValue(customer, 'address.state');
        expect(state).toEqual('QLD');
    });
});