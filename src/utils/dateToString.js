export function yearMonthDayString(date) {
  return `${date.getFullYear(date)}-${(1 + date.getMonth(date))
    .toString()
    .padStart(2, '0')}-${date.getDate(date).toString().padStart(2, '0')}`;
}

export function yearMonthOneString(date) {
  return `${date.getFullYear(date)}-${(1 + date.getMonth(date))
    .toString()
    .padStart(2, '0')}-01`;
}
