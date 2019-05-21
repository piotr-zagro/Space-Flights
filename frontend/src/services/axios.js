import axios from 'axios'
import config from '../config'

let instance = axios.create({
    baseURL: config.apiUrl,
    headers: {
        'Authorization': `Bearer ${localStorage.getItem('user-token')}`
        // 'Authorization': `Bearer`
    }
});

let setToken = (token) => {
    instance.defaults.headers.common['authorization'] = `Bearer ${token}`
}

export default instance
export {setToken}
