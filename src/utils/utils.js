
import { getMethod } from './api';


/*

('0' + 4).slice(-2)  // '04'   completa con ceros a la izquierda

r = r.replace(/ /g,"_"); //returns my_name

var d = new Date(year, month, day);
d.setMonth(d.getMonth() + 8);

	const id = "ctl03_Tabs1";
	print (id.slice(id.length - 5)); //Outputs: Tabs1
primeros
	const string = "0123456789";
  const string = "01234-123456789";
	print (string.slice(0, 2)); // "01"
	print (string.slice(0, 8)); // "01234567"
	print (string.slice(5, 13)); // "3456"
sin decimales
	Math.trunc(42.84);    // 42
	Math.trunc(0.123);    //  0
Number to string
	n.toString()
	""+n
  */


export function isValidDate(d) {
  let f = new Date(d);
  return !isNaN(f.getTime());
}

// Devuelve CUIT con formato 20-44123225-8
export function mostrarCUIT(value) {
  try {
    value = value.split('');
    value.splice(2, 0, '-');
    value.splice(11, 0, '-');
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
  
  let num = "" + numero;  
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
// Devuelve un Date con formato 5 dic. 2021
export function txt_to_DD_MMM_AAAA(fecha) {
  let dd = new Date(fecha).getDate();
  let mm = new Date(fecha).toLocaleDateString('es-AR', { timeZone: 'UTC',  month: 'short' });
  let yyyy = new Date(fecha).getFullYear();
  return dd + ' ' + mm + ' '  + yyyy;
 
}

// *******************************************************************
// Devuelve un Date con formato 5 dic. 2021
export function txt_to_DDMMAAAA(fecha) {
  let dd = new Date(fecha).getDate();
  let mm = new Date(fecha).getMonth();
  let yyyy = new Date(fecha).getFullYear();
  return dd + '-' + mm + '-'  + yyyy;
 
}

// *******************************************************************
// entra date
// Devuelve un string con formato YYYY-MM-DD  con guion ...yearMonthDayNum
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

// entra date
// Devuelve un string con formato YYYY-MM-DD  sin barra ni guion
export function date_to_YYYYMMDD_s(fecha) {

  if(fecha ===undefined || fecha ===null){
    return null
  }else{
    return `${fecha.getFullYear(fecha)}${(1 + fecha.getMonth(fecha)).toString().padStart(2, '0')}${fecha
      .getDate(fecha)
      .toString()
      .padStart(2, '0')}`;
  } 
}

// entra base de datos
// Devuelve un string con formato "mar.2021"
export function DB_to_MMMAAAA(fecha) {

  
  if(fecha ===undefined || fecha ===null){
    return null
  }else{
    let mm = new Date(fecha).toLocaleDateString('es-AR', { timeZone: 'UTC',  month: 'short' });
    let yyyy = new Date(fecha).getFullYear();
    return mm + yyyy ;
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

// entra float o int y sale 99.000,20 
export function formato_moneda(num) {

    return Intl.NumberFormat('es-AR', { minimumFractionDigits: 2 }).format(Number(num));
  
}


export function buscarCAC(CACs, fechaOP, CACtipo){

          
  let rta = 0.0;
  if(fechaOP){
    
    if(CACtipo==="Construción"){
      rta = CACs?.find(cac => cac.fecha.slice(0, 7) === fechaOP?.slice(0, 7))?.definitivo;
    }else if(CACtipo==="Materiales"){
      rta = CACs?.find(cac => cac.fecha.slice(0, 7) === fechaOP?.slice(0, 7))?.materiales;
    }else if(CACtipo==="Mano de Obra"){
      rta = CACs?.find(cac => cac.fecha.slice(0, 7) === fechaOP?.slice(0, 7))?.manodeobra;
    }

    if(!rta){// si no encuenta una CAC definitivo, busco el mes anterior

      let d = new Date(fechaOP.slice(0, 10) + " " + fechaOP.slice(12, 5));
      
      d.setMonth(d.getMonth() - 1)

      if(CACtipo==="Construción"){
        rta = CACs?.find(cac => cac.fecha.slice(0, 7) === date_to_YYYYMMDD(d).slice(0, 7))?.definitivo;
      }else if(CACtipo==="Materiales"){
        rta = CACs?.find(cac => cac.fecha.slice(0, 7) === date_to_YYYYMMDD(d).slice(0, 7))?.materiales;
      }else if(CACtipo==="Mano de Obra"){
        rta = CACs?.find(cac => cac.fecha.slice(0, 7) === date_to_YYYYMMDD(d).slice(0, 7))?.manodeobra;
      }

      if(!rta){// si no encuenta una CAC definitivo, busco el mes anterior
        d.setMonth(d.getMonth() - 1)        

        if(CACtipo==="Construción"){
          rta = CACs?.find(cac => cac.fecha.slice(0, 7) === date_to_YYYYMMDD(d).slice(0, 7))?.definitivo;
        }else if(CACtipo==="Materiales"){
          rta = CACs?.find(cac => cac.fecha.slice(0, 7) === date_to_YYYYMMDD(d).slice(0, 7))?.materiales;
        }else if(CACtipo==="Mano de Obra"){
          rta = CACs?.find(cac => cac.fecha.slice(0, 7) === date_to_YYYYMMDD(d).slice(0, 7))?.manodeobra;
        }
      }
    }
}
  return rta;
}



