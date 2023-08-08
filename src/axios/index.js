import axios from 'axios'
import {USER_AUTH} from "../static/constants";

const baseURL = process.env.REACT_APP_SERVER_URL


const aFetch = axios.create({
    baseURL,
    timeout: 2000,
    // headers: {'X-Custom-Header': 'foobar'}
});


aFetch.interceptors.request.use(c => {
    const user = localStorage.getItem(USER_AUTH);
    c.headers.Authorization = (user && user.token) ? `Bearer ${user.token}` : '';
    return c;
}, err => console.error(err))

aFetch.interceptors.response.use(c => c, err => {
    const originalRequest = err.config;

    if (err.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        return axios.get(baseURL + '/user/auth/refresh/').then((response) => {
            const userAuth = response.data
            console.log(userAuth)
            localStorage.setItem(USER_AUTH, JSON.stringify(userAuth))
            // Replace the access token in the original request config
            originalRequest.headers['Authorization'] = `Bearer ${userAuth.token}`;
            return aFetch(originalRequest);
        });
    }

    return Promise.reject(err);
})

export default aFetch