/** Display only: never calculate prices, grades or payment amounts here. */
export function formatMoney(minorUnits: number, currency = 'INR') {
  if (!Number.isSafeInteger(minorUnits) || !/^[A-Z]{3}$/.test(currency))
    throw new RangeError('Invalid money value');
  const formatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
  });
  const digits = formatter.resolvedOptions().maximumFractionDigits ?? 2;
  return formatter.format(minorUnits / 10 ** digits);
}

export function formatDateTime(
  utcTimestamp: string,
  timeZone = 'Asia/Kolkata',
) {
  if (
    !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,7})?Z$/.test(utcTimestamp)
  )
    throw new RangeError('An explicit UTC timestamp is required');
  const date = new Date(utcTimestamp);
  if (
    !Number.isFinite(date.getTime()) ||
    date.toISOString().slice(0, 19) !== utcTimestamp.slice(0, 19)
  )
    throw new RangeError('Invalid UTC timestamp');
  return new Intl.DateTimeFormat('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone,
  }).format(date);
}
