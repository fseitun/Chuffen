import axios from 'axios';

const PATH = 'http://localhost:3000/'; //ver si se hace (y cómo se hace) desde el .env

export const getMethod = async (url) => {
  const { data } = await axios.get(`${PATH}${url}`);
  return data;
};

export const postMethod = async (url, newData) => {
  const { data } = await axios.post(`${PATH}${url}`, newData);
  return data;
};

export const deleteMethod = async (url, rowId) => {
  return await axios.delete(`${PATH}${url}`, {
    headers: {
      'Content-Type': 'application/json'
    },
    data: JSON.stringify({ id: `${rowId}` })
  });
};
