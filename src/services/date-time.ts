import { Service } from '.';

const base: Intl.DateTimeFormatOptions = {
    hourCycle: 'h23',
};

const timeFormatter = new Intl.DateTimeFormat(undefined, {
    hour: 'numeric',
    minute: 'numeric',
    ...base,
});

const timeWithSecondFormatter = new Intl.DateTimeFormat(undefined, {
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    ...base,
});

const dateTimeFormatter = new Intl.DateTimeFormat(undefined, {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    ...base,
});

const dateTimeWithSecondFormatter = new Intl.DateTimeFormat(undefined, {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    ...base,
});

const noYearDateTimeFormatter = new Intl.DateTimeFormat(undefined, {
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    ...base,
});

const noYearDateTimeWithSecondFormatter = new Intl.DateTimeFormat(undefined, {
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    ...base,
});

@Service()
export class DateTime {
    static readonly second = 1000;
    static readonly minute = DateTime.second * 60;
    static readonly hour = DateTime.minute * 60;
    static readonly day = DateTime.hour * 24;
    static readonly month = DateTime.day * (365.25 / 12);
    static readonly year = DateTime.month * 12;

    absolute(hisTime: number, withSecond = false, nowTime: number = Date.now()): string {
        const his = new Date(hisTime);
        const now = new Date(nowTime);
        if (his.getFullYear() === now.getFullYear()) {
            if (his.getMonth() === now.getMonth() && his.getDate() === now.getDate()) {
                return `今日 ${(withSecond ? timeWithSecondFormatter : timeFormatter).format(his)}`;
            }
            return (withSecond ? noYearDateTimeWithSecondFormatter : noYearDateTimeFormatter).format(his);
        }
        return (withSecond ? dateTimeWithSecondFormatter : dateTimeFormatter).format(his);
    }

    relative(diffTime: number): string {
        const nYear = diffTime / DateTime.year;
        const nMonth = diffTime / DateTime.month;
        const nDay = diffTime / DateTime.day;
        const nHour = diffTime / DateTime.hour;
        const nMin = diffTime / DateTime.minute;

        if (nYear >= 1) return `${Math.floor(nYear)} 年前`;
        else if (nMonth >= 1) return `${Math.floor(nMonth)} ヶ月前`;
        else if (nDay >= 1) return `${Math.floor(nDay)} 日前`;
        else if (nHour >= 1) return `${Math.floor(nHour)} 時間前`;
        else if (nMin >= 1) return `${Math.floor(nMin)} 分前`;
        else if (nMin >= 0) return 'たった今';
        else if (nMin > -1) return 'もうすぐ';
        else if (nHour > -1) return `${Math.floor(-nMin)} 分後`;
        else if (nDay > -1) return `${Math.floor(-nHour)} 時間後`;
        else if (nMonth > -1) return `${Math.floor(-nDay)} 日後`;
        else if (nYear > -1) return `${Math.floor(-nMonth)} ヶ月後`;
        else return `${Math.floor(-nYear)} 年後`;
    }

    diff(
        hisTime: Date | number = 0,
        withSecond = false,
        maxRelativeDiff = DateTime.day * 7,
        nowTime: Date | number = Date.now(),
    ): string {
        hisTime = typeof hisTime === 'number' ? hisTime : hisTime.getTime();
        nowTime = typeof nowTime === 'number' ? nowTime : nowTime.getTime();
        if (!hisTime) return 'N/A';

        const diffTime = nowTime - hisTime;

        if (diffTime >= maxRelativeDiff) {
            return this.absolute(hisTime, withSecond, nowTime);
        } else {
            return this.relative(diffTime);
        }
    }
}
