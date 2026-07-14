import axios from 'axios';

const BASE_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';

export const fetchAPOD = async (date) => {
  const res = await axios.get(`${BASE_URL}/api/apod?date=${date}`);
  return res.data;
};

export const fetchNEO = async (date) => {
  const res = await axios.get(`${BASE_URL}/api/neo?start_date=${date}`);
  return res.data;
};

export const fetchMarsPhotos = async (date, rover, camera) => {
  let url = `${BASE_URL}/api/mars?date=${date}&rover=${rover.toLowerCase()}`;
  if (camera && camera !== 'ALL') {
    url += `&camera=${camera}`;
  }
  const res = await axios.get(url);
  return res.data;
};

export const fetchEPIC = async (date) => {
  const res = await axios.get(`${BASE_URL}/api/epic?date=${date}`);
  return res.data;
};

export const searchNASAImages = async (query, page = 1) => {
  const res = await axios.get(`${BASE_URL}/api/image?query=${encodeURIComponent(query)}&page=${page}`);
  return res.data;
};

export const generateApodSummary = async (explanation) => {
  const res = await axios.post(`${BASE_URL}/api/apod/summary`, { explanation });
  return res.data;
};
