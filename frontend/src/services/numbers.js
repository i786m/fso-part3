import axios from 'axios';

const baseUrl = '/api/persons';

const getAll = () => {
  const req = axios.get(baseUrl);
  return req.then(res => res.data);
};

const addContact = newContact => {
  const req = axios.post(baseUrl, newContact);
  return req.then(res => res.data);
};

const updateContact = (id, newContact) => {
  const req = axios.put(`${baseUrl}/${id}`, newContact);
  return req.then(res => res.data);
};

const deleteContact = id => {
  const req = axios.delete(`${baseUrl}/${id}`);
  return req.then(console.log(id, 'deleted'));
};

const numberService = {
  getAll,
  addContact,
  updateContact,
  deleteContact,
};

export default numberService;
