import axios from 'axios';

const PATH = 'http://localhost:3000/'; //ver si se hace (y cómo se hace) desde el .env

export const listarDolar = async (sociedad) => {
  const { data } = await axios.get(
    `${PATH}dolar/listar/${sociedad}`
  );
  return data;
};

export const cargarDolar = async (sociedad, nuevoDolar) => {
  axios.post(`${PATH}dolar/agregar/${sociedad}`, nuevoDolar);
  return nuevoDolar;
};

export const eliminarDolar = async (sociedad, arrayIds) => {
  arrayIds.forEach((el) => {
    console.log(
      `${PATH}dolar/eliminar/${sociedad}, body: id:${el}`
    );
    axios.delete(`${PATH}dolar/eliminar/${sociedad}`, {
      headers: {
        'Content-Type': 'application/json'
      },
      data: JSON.stringify({"id": `${el}`})
    });
  });
};
