import axios from 'axios';

export const listarDolar = async (sociedad) => {
  const { data } = await axios.get(
    `http://localhost:3000/dolar/listar/${sociedad}`
  );
  return data;
};

export const cargarDolar = async (sociedad, nuevoDolar) => {
  axios.post(`http://localhost:3000/dolar/agregar/${sociedad}`, nuevoDolar);
  return nuevoDolar;
};

export const eliminarDolar = async (sociedad, arrayIds) => {
  arrayIds.forEach((el) => {
    console.log(
      `http://localhost:3000/dolar/eliminar/${sociedad}, body: id:${el}`
    );
    axios.delete(`http://localhost:3000/dolar/eliminar/${sociedad}`, {
      headers: {
        'Content-Type': 'application/json'
      },
      data: JSON.stringify({"id": `${el}`})
    });
  });
};
