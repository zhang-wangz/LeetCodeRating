
const dateRegex = /(?=(YYYY|YY|MM|DD|HH|mm|ss|ms))\1([:/]*)/g;
const timespan = {
  YYYY: ['getFullYear', 4],
  YY: ['getFullYear', 2],
  MM: ['getMonth', 2, 1], // getMonth is zero-based, thus the extra increment field
  DD: ['getDate', 2],
  HH: ['getHours', 2],
  mm: ['getMinutes', 2],
  ss: ['getSeconds', 2],
  ms: ['getMilliseconds', 3],
};

function formatter(str?: string, date?: Date, utc?: boolean): string {
  if (typeof str !== 'string') {
    date = str;
    str = 'YYYY-MM-DD';
  }

  return str.replace(dateRegex, (match: string, key: keyof typeof timespan, rest?: string) => {
    const args = timespan[key];
    const chars = args[1];
    let name = args[0] as keyof Date;
    if (utc === true) {
      name = `getUTC${String(name).slice(3)}` as keyof Date;
    }
    if (!date) {
      date = new Date();
    }
    const val = `00${String((date[name] as typeof Date)() + (args[2] || 0))}`;
    return val.slice(-chars) + (rest || '');
  });
}

formatter.utc = (str?: string, date?: Date): string => {
  return formatter(str, date, true);
};

export default formatter;
