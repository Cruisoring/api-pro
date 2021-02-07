import 'jest';
import {ObjectHelper} from '../src/helpers/object-helper'

describe('Test ObjectHelper', () => {
    const testObj: any = {
        fistName: 'Tom',
        lastName: 'Visco',
        age: 24,
        address: {
            line1: '12 Albert st',
            suburb: 'Sunny coast',
            postCode: '4123',
            state: 'QLD'
        }
    }
    test('test valuePathsOf()', () => {
        const paths: string[] = ObjectHelper.valuePathsOf(testObj);
        console.log(JSON.stringify(paths));
    });
});