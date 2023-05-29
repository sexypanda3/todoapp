import axios from 'axios'
import Cookies from 'universal-cookie';
import Auth from './auth'

const cookies = new Cookies();

const SERVER_URL = 'http://localhost:8080'

const instance = axios.create({
    baseURL: SERVER_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + cookies.get('token')
    }
})


export default instance