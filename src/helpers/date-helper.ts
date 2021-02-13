/* eslint-disable @typescript-eslint/no-non-null-assertion */
export abstract class DateHelper {
    public static readonly expectedDateFormats: RegExp[] = [
        /^(?<year>\d{4})[-|/|\\](?<month>\d{2})[-|/|\\](?<day>\d{2})(T(?<hour>\d\d):(?<minute>\d\d):(?<second>\d\d(.\d{3})?)Z?)?$/,
        /^(?<day>\d{2})[-|/|\\](?<month>\d{2})[-|/|\\](?<year>\d{4})$/,
    ];
    public static NullDate: Date = new Date(0, 0, 1);

    public static readonly NullDateStrings: string[] = [
        '1970-01-01T00:00:00Z',
        '1970-01-01T00:00:00',
        '0001-01-01T00:00:00',
        '0001-01-01T00:00:00Z',
        '01/01/2000',
        '1900-01-01T00:00:00',
        '2000-01-01T00:00:00Z',
    ];

    public static isDateString(value: string): boolean {
        return this.NullDateStrings.includes(value) || DateHelper.expectedDateFormats.some((f) => f.test(value));
    }

    public static asDate(dateString: string): Date {
        if (DateHelper.NullDateStrings.includes(dateString)) {
            return DateHelper.NullDate;
        }

        const matchedFormat: RegExp | undefined = DateHelper.expectedDateFormats.find((f) => f.test(dateString));
        if (!matchedFormat) {
            throw SyntaxError(`'${dateString}' is not in an expected date format.`);
        }

        const matchedResult = matchedFormat.exec(dateString);
        const year = Number(matchedResult!.groups!.year);
        const month = Number(matchedResult!.groups!.month);
        const day = Number(matchedResult!.groups!.day);
        const hour = Number(matchedResult!.groups!.hour ?? '0');
        const minute = Number(matchedResult!.groups!.minute ?? '0');
        const second = Number(matchedResult!.groups!.second ?? '0');

        const parsedDate: Date = new Date(year, month - 1, day, hour, minute, second);
        return parsedDate;
    }

    public static utcNow(): string {
        const now: Date = new Date();
        return now.toUTCString();
    }
}
