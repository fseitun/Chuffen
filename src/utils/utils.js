
import { getMethod } from './api';
// import moment from 'moment';
const Qdigitos = process.env.REACT_APP_Q_DIGITOS_FACTURA;

export function isValidDate(d) {
  let f = new Date(d);
  return !isNaN(f.getTime());
}

// Devuelve CUIT con formato 20-44123225-8
export function mostrarCUIT(value) {
  try {
    value = value.split('');
    value.splice(2, 0, '-');
    //value.splice(5, 0, '.');
    //value.splice(9, 0, '.');
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
// Devuelve un string con formato YYYY-MM-DD
export function yearMonthDayNum(fecha) {

  if(fecha ===undefined || fecha ===null){
    return null
  }else{
    return `${fecha.getFullYear(fecha)}${(1 + fecha.getMonth(fecha)).toString().padStart(2, '0')}${fecha
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

export async function isNumberUsedDig(endpoint, idSociety, empresaId, numero) {
  

  // let dig = process.env.Q_DIGITOS_COM_FACTURA;
  let num = "" + numero; 
  if(num.length > parseInt(Qdigitos)){
    num = num.slice(num.length - parseInt(Qdigitos));
  } 
  
  let url = `${endpoint}/checknumero/${idSociety}/${empresaId}/${num}`;
  let data = await getMethod(url);
  
  return (!!data);

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




// *******************************************************************
// entra date
// Devuelve un string con formato YYYY-MM-DD  ...yearMonthDayNum
export function date_to_YYYYMMDD(fecha) {

  if(fecha ===undefined || fecha ===null){
    return null
  }else{
    return `${fecha.getFullYear(fecha)}-${(1 + fecha.getMonth(fecha)).toString().padStart(2, '0')}-${fecha
      .getDate(fecha)
      .toString()
      .padStart(2, '0')}`;
  } 
}

// entra base de datos
// Devuelve un string con formato 24/5/2021
export function DB_to_DDMMAAAA(fecha) {

  
  if(fecha ===undefined || fecha ===null){
    return null
  }else{
    return new Date(fecha).toLocaleDateString('es-AR', { timeZone: 'UTC' });
  }
}

// entra base de datos
// Devuelve un Date para un picker
export function DB_to_date(fecha) {

  
  if(fecha ===undefined || fecha ===null){
    return null
  }else{
    return new Date(fecha);
  }
}


/*
var d = new Date(year, month, day);
d.setMonth(d.getMonth() + 8);

ultimos
	const id = "ctl03_Tabs1";
	console.log(id.slice(id.length - 5)); //Outputs: Tabs1
primeros
	const string = "0123456789";
  const string = "01234-123456789";
	console.log(string.slice(0, 2)); // "01"
	console.log(string.slice(0, 8)); // "01234567"
	console.log(string.slice(5, 13)); // "3456"
sin decimales
	Math.trunc(42.84);    // 42
	Math.trunc(0.123);    //  0
Number to string
	n.toString()
	""+n
  */
