import { getMethod } from './api';
// import moment from 'moment';

export function isValidDate(d) {
  let f = new Date(d);
  return !isNaN(f.getTime());
}

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

// entra base de datos
// Devuelve un Date con formato 1/5/2021
export function mostrarFecha(fecha) {

  
  if(fecha ===undefined || fecha ===null){
    return null
  }else{
    return new Date(fecha).toLocaleDateString('es-AR', { timeZone: 'UTC' });
  }
}

// Devuelve un Date con formato 5 dic. 2021
export function mostrarFechaMesTXT(fecha) {
  let dd = new Date(fecha).getDate();
  let mm = new Date(fecha).toLocaleDateString('es-AR', { timeZone: 'UTC',  month: 'short' });
  let yyyy = new Date(fecha).getFullYear();
  return dd + ' ' + mm + ' '  + yyyy;
 
}

// entra date
// Devuelve un string con formato YYYY-MM-DD
export function yearMonthDayString(fecha) {

  if(fecha ===undefined || fecha ===null){
    return null
  }else{
    return `${fecha.getFullYear(fecha)}-${(1 + fecha.getMonth(fecha)).toString().padStart(2, '0')}-${fecha
      .getDate(fecha)
      .toString()
      .padStart(2, '0')}`;
  }

 
}

// entra date
// Devuelve una fecha con dia 1
export function dateToStringWithDayEqualToOne(date) {
  return `${date.getFullYear(date)}-${(1 + date.getMonth(date)).toString().padStart(2, '0')}-01`;
}

export async function isNumberUsed(endpoint, idSociety, empresaId, numero) {
  let url = `${endpoint}/mostrar/${idSociety}/${empresaId}/${numero}`;
  let data = await getMethod(url);
  return !!data;
}

export async function isDateUsed(endpoint, idSociety, date) {
  let url = `${endpoint}/mostrar/${idSociety}/${date}`;
  let data = await getMethod(url);
  return !!data;
}

export function onlyNumbers(event, setFieldValue, typeOfData) {
  event.preventDefault();
  const { value } = event.target;
  const regex = /^\d{0,3}(\.\d{0,2})?$/;
  if (regex.test(value.toString())) {
    setFieldValue(typeOfData, value.toString());
  }
}
