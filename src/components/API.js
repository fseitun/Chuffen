import axios from 'axios';

const PATH = 'http://localhost:3000/'; //ver si se hace (y cómo se hace) desde el .env

export const listDollar = async (idSociedad) => {
  const { data } = await axios.get(`${PATH}dolar/listar/${idSociedad}`);
  return data;
};

export const loadDollar = async (idSociedad, nuevoDolar) => {
  const { data } = await axios.post(
    `${PATH}dolar/agregar/${idSociedad}`,
    nuevoDolar
  );
  return data;
};

export const deleteDollar = async (idSociedad, rowId) => {
  return await axios.delete(`${PATH}dolar/eliminar/${idSociedad}`, {
    headers: {
      'Content-Type': 'application/json'
    },
    data: JSON.stringify({ id: `${rowId}` })
  });
};

export const changeCellDollar = async (idSociedad, newData) => {
  const { data } = await axios.post(
    `${PATH}dolar/modificar/${idSociedad}`,
    newData
  );
  return data;
};
