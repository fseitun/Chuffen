import axios from 'axios';

const PATH = 'http://localhost:3000/'; //ver si se hace (y cómo se hace) desde el .env

export const listarDolar = async (idSociedad) => {
  const { data } = await axios.get(`${PATH}dolar/listar/${idSociedad}`);
  return data;
};

export const cargarDolar = async (idSociedad, nuevoDolar) => {
  const { data } = await axios.post(
    `${PATH}dolar/agregar/${idSociedad}`,
    nuevoDolar
  );
  return data;
};

export const eliminarDolar = async (idSociedad, selectedRows) => {
  await Promise.all(
    selectedRows.map((el) => {
      return axios.delete(`${PATH}dolar/eliminar/${idSociedad}`, {
        headers: {
          'Content-Type': 'application/json'
        },
        data: JSON.stringify({ id: `${el}` })
      });
    })
  );
};

export const changeCellDollar = async (idSociedad, newData) => {
  const { data } = await axios.post(
    `${PATH}dolar/modificar/${idSociedad}`,
    newData
  );
  return data;
};
