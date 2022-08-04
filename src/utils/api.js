import axios from 'axios';

const apiServerUrl = process.env.REACT_APP_API_SERVER;

const token = JSON.parse(localStorage.getItem("loggedUserInfo"))?.token;

axios.defaults.headers.common = {
  'Authorization': 'Bearer ' + token
};

export const getMethod = async url => {
  const { data } = await axios.get(`${apiServerUrl}${url}`);
  return data;
};

export const postMethod = async (url, newData) => {
  const { data } = await axios.post(`${apiServerUrl}${url}`, newData);
  return data;
};

export const deleteMethod = async (url, infoOfElementToDelete) => {
  return await axios.delete(`${apiServerUrl}${url}`, { data: infoOfElementToDelete });
};
