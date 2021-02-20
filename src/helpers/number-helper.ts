export abstract class NumberHelper {
    //The number of digits to appear after the decimal point by default.
    public static DefaultDigits = 5;

    private static factorByDigits: { [digits: number]: number } = {};

    public static getFactorOfDigits(digits: number): number {
        if (!(digits in NumberHelper.factorByDigits)) {
            const factorInString: string = digits >= 0 ? `1${'0'.repeat(digits)}` : `0.${'0'.repeat(-digits - 1)}1`;
            NumberHelper.factorByDigits[digits] = +factorInString;
        }
        return NumberHelper.factorByDigits[digits];
    }

    public static round(num: number | string, digits: number = NumberHelper.DefaultDigits) {
        const value: number = +num;
        const factor: number = NumberHelper.getFactorOfDigits(digits);

        return Math.round(value * factor) / factor;
    }
}
