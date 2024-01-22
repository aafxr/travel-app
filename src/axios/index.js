import axios from 'axios'

import constants, {ACCESS_TOKEN, REFRESH_TOKEN, UNAUTHORIZED, USER_AUTH} from "../static/constants";
import clearUserData from "../utils/clearUserData";
import storeDB from "../db/storeDB/storeDB";
import sleep from "../utils/sleep";

const baseURL = process.env.REACT_APP_SERVER_URL


const aFetch = axios.create({
    baseURL,
    timeout: 4000,
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
 * @param {UserType} userAuth
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
    //задержка для запросов  во время обновления токенов (для исключения повторного отправления refresh)
    if (!c.url.includes('/user/auth/refresh/')) {
        while (aFetch.refresh) {
            await sleep(200)
        }
    }

    await getTokensFromDB()

    access_token && (c.headers.Authorization = `Bearer ${access_token}`)
    if (c.url.includes('/user/auth/remove/') && c.data.refresh_token) {
        await Promise.all([
            storeDB.removeElement(constants.store.STORE, ACCESS_TOKEN),
            storeDB.removeElement(constants.store.STORE, REFRESH_TOKEN)
        ])
    }
    return c
}, err => console.error(err))


aFetch.interceptors.response.use(
    async (response) => {
        const url = response.config.url
        if (urlWithAuth.includes(url)) {
            const {ok, data} = response.data
            if (ok) {
                saveTokensToDB(data).catch(console.error)
            }
        }
        if (response.data.message === "Unauthorized" && !response.config._retry) {
            response.config._retry = true
            console.log("Пользователь не авторизован (token expired). Попытка отправить повторный запрос...")
            try {
                await refreshAuth()
                const retryResponse = await aFetch(response.config)
                console.log('Результат повторного запроса ', retryResponse)
                return retryResponse
            } catch (err) {
                clearUserData()
                return response
            }
        }
        return response
    },
    async (err) => {
        console.error(err)
        if(err.message === "Network Error") return err

        const originalRequest = err.config;
        if (err.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                await refreshAuth()
                return await aFetch(originalRequest)
            } catch (err) {
                return err
            }
        }
    })

export default aFetch


function refreshAuth() {
    return new Promise(async (resolve, reject) => {
        try {
            aFetch.refresh = true

            await getTokensFromDB()

            const response = await axios.post(baseURL + '/user/auth/refresh/', {refresh_token}, {
                headers: {Authorization: refresh_token ? `Bearer ${refresh_token}` : ''}
            })

            const {ok, data: userAuth} = response.data
            if (ok) {
                await axios.get(baseURL + '/user/auth/refresh/confirm/', {
                    headers: {
                        Authorization: `Bearer ${userAuth.refresh_token}`,
                    }
                })
                await saveTokensToDB(userAuth)
                return resolve()
            } else if (window) {
                window.localStorage.setItem(USER_AUTH, JSON.stringify(null))
            } else if (postMessage) {
                postMessage({type: UNAUTHORIZED})
            }
            return reject(response)
        } catch (err) {
            return reject(err)
        } finally {
            aFetch.refresh = false
        }
    })
}
