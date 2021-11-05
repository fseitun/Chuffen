// Devuelve CUIT con formato 20-44.123.225-8
export function mostrarCUIT(value) {
  try {
    value = value.split('');
    value.splice(2, 0, '-');
    value.splice(5, 0, '.');
    value.splice(9, 0, '.');
    value.splice(13, 0, '-');
    return value.join('');
  } catch (e) {
    console.log('hubo un error: ', e);
    return null;
  }
}

// Devuelve un Date con formato 1-5-2021
export function mostrarFecha(fecha) {
  return new Date(fecha).toLocaleDateString('es-AR', { timeZone: 'UTC' });
}

// Devuelve un string con formato YYYY-MM-DD
export function yearMonthDayString(date) {
  return `${date.getFullYear(date)}-${(1 + date.getMonth(date)).toString().padStart(2, '0')}-${date
    .getDate(date)
    .toString()
    .padStart(2, '0')}`;
}

// Devuelve una fecha con dia 1
export function dateToStringWithDayEqualToOne(date) {
  return `${date.getFullYear(date)}-${(1 + date.getMonth(date)).toString().padStart(2, '0')}-01`;
}
