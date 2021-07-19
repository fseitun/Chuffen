import axios from 'axios';

const PATH = 'http://localhost:3000/'; //ver si se hace (y cómo se hace) desde el .env

export const listarDolar = async (idSociedad) => {
  const { data } = await axios.get(`${PATH}dolar/listar/${idSociedad}`);
  return data;
};

export const cargarDolar = async (idSociedad, nuevoDolar) => {
  axios.post(`${PATH}dolar/agregar/${idSociedad}`, nuevoDolar);
  return nuevoDolar;
};

export const eliminarDolar = async (idSociedad, selectedRows) => {
  selectedRows.forEach((el) => {
    console.log(`${PATH}dolar/eliminar/${idSociedad}, body: id:${el}`);
    axios.delete(`${PATH}dolar/eliminar/${idSociedad}`, {
      headers: {
        'Content-Type': 'application/json'
      },
      data: JSON.stringify({ id: `${el}` })
    });
  });
};

export const modificarCeldaDolar = async (idSociedad, nuevoDato) => {
  axios.post(`${PATH}dolar/modificar/${idSociedad}`, nuevoDato);
  return nuevoDato;
};
