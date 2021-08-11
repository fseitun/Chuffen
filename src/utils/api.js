import axios from 'axios';

const apiServerUrl = process.env.REACT_APP_API_SERVER;

export const getMethod = async url => {
  const { data } = await axios.get(`${apiServerUrl}${url}`);
  return data;
};

export const postMethod = async (url, newData) => {
  const { data } = await axios.post(`${apiServerUrl}${url}`, newData);
  return data;
};

export const deleteMethod = async (url, rowId) => {
  return await axios.delete(`${apiServerUrl}${url}`, {
    headers: {
      'Content-Type': 'application/json',
    },
    data: JSON.stringify({ id: `${rowId}` }),
  });
};
