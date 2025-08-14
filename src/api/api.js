import axios from 'axios';

export default axios.create({
  baseURL: 'http://localhost:8080/api',
  withCredentials: false, // optional, needed only if cookies or sessions are used
});
