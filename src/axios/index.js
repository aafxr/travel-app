import axios from 'axios'
import constants, {ACCESS_TOKEN, REFRESH_TOKEN, UNAUTHORIZED, USER_AUTH} from "../static/constants";
import storeDB from "../db/storeDB/storeDB";

const baseURL = process.env.REACT_APP_SERVER_URL


const aFetch = axios.create({
    baseURL,
    timeout: 2000,
});

const urlWithAuth = [
    '/user/auth/tg/',
    '/user/auth/refresh/'
]

let access_token
let refresh_token


async function getTokensFromDB() {
    await Promise.all([
        storeDB.getElement(constants.store.STORE, ACCESS_TOKEN).then(res => access_token = res[0]?.value),
        storeDB.getElement(constants.store.STORE, REFRESH_TOKEN).then(res => refresh_token = res[0]?.value)
    ])
        .catch(console.error)
}

/**
 * Функция сохраняет токеныв indexedDB
 * @param {UserAppType} userAuth
 * @return {Promise<Awaited<number|string|Date|ArrayBufferView|ArrayBuffer|IDBValidKey[]>[]>}
 */
async function saveTokensToDB(userAuth) {
    return Promise.all([
        storeDB.editElement(constants.store.STORE, {name: ACCESS_TOKEN, value: userAuth.token}),
        storeDB.editElement(constants.store.STORE, {name: REFRESH_TOKEN, value: userAuth.refresh_token})
    ])
}


aFetch.refresh = false

aFetch.interceptors.request.use(async (c) => {
    await getTokensFromDB()
    c.headers.Authorization = access_token ? `Bearer ${access_token}` : ''
    if (c.url.includes('/user/auth/remove/') && c.data.refresh_token) {
        await Promise.all([
            storeDB.removeElement(constants.store.STORE, ACCESS_TOKEN),
            storeDB.removeElement(constants.store.STORE, REFRESH_TOKEN)
        ])
    }
    if (aFetch.refresh) {
        return new Promise((res) => {
            setTimeout(() => res(c), 1500)
        })
    } else {
        return c;
    }
}, err => console.error(err))


aFetch.interceptors.response.use(
    response => {
        const url = response.config.url
        if (urlWithAuth.includes(url)) {
            const {ok, data} = response.data
            if (ok) {
                saveTokensToDB(data)
                    .catch(console.error)
            }
        }
        return response
    },
    err => {
        const originalRequest = err.config;
        if (err.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            aFetch.refresh = true
            return axios.get(baseURL + '/user/auth/refresh/', {
                headers: {
                    Authorization: refresh_token ? `Bearer ${refresh_token}` : '',
                }
            }).then((response) => {
                const {ok, data: userAuth} = response.data
                if (ok) {
                    axios.get(baseURL + '/user/auth/refresh/confirm/', {
                        headers: {
                            Authorization: `Bearer ${userAuth.refresh_token}`,
                        }
                    }).then(() => {
                        saveTokensToDB(userAuth)
                            .catch(console.error)
                        originalRequest.headers['Authorization'] = `Bearer ${userAuth.token}`;
                    })
                    return axios(originalRequest);
                } else if (window) {
                    window.localStorage.setItem(USER_AUTH, JSON.stringify(null))
                } else if (postMessage) {
                    postMessage({type: UNAUTHORIZED})
                }
                return originalRequest
            }).finally(() => aFetch.refresh = false)
        }
        return Promise.reject(err);
    })

export default aFetch
