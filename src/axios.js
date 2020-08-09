import axios from 'axios';
const instance = axios.create({
    baseURL: 'https://dlogservice.herokuapp.com/'
});
export default instance;