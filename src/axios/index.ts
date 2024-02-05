import axios, {AxiosInstance} from 'axios'
import {ACCESS_TOKEN, REFRESH_TOKEN, UNAUTHORIZED, USER_AUTH} from "../static/constants";
import {APIResponseType} from "../api/fetch/types/APIResponseType";
import clearUserData from "../utils/clearUserData";
import {StoreName} from "../types/StoreName";
import {UserType} from "../types/UserType";
import {DB} from "../classes/db/DB";
import sleep from "../utils/sleep";


interface AxiosInstanceWithFlag extends AxiosInstance{
    refresh:boolean
}


const baseURL = process.env.REACT_APP_SERVER_URL


const aFetch = axios.create({
    baseURL,
    timeout: 2000,
}) as AxiosInstanceWithFlag;


const urlWithAuth = [
    '/user/auth/tg/',
    '/user/auth/refresh/'
]

let access_token:string
let refresh_token:string


async function getTokensFromDB() {
    await Promise.all([
        DB.getOne<{value:string}>(StoreName.STORE, ACCESS_TOKEN).then((res) => access_token = res ? res?.value : ''),
        DB.getOne<{value:string}>(StoreName.STORE, REFRESH_TOKEN).then((res) => refresh_token = res ? res?.value : '')
    ])
        .catch(console.error)
}

type UserAuthType = {
    token:string
    refresh_token:string
}

/**
 * Функция сохраняет токеныв indexedDB
 * @param {UserType} userAuth
 * @return {Promise<Awaited<number|string|Date|ArrayBufferView|ArrayBuffer|IDBValidKey[]>[]>}
 */
async function saveTokensToDB(userAuth:UserAuthType) {
    return Promise.all([
        DB.update(StoreName.STORE, {name: ACCESS_TOKEN, value: userAuth.token}),
        DB.update(StoreName.STORE, {name: REFRESH_TOKEN, value: userAuth.refresh_token})
    ])
}


aFetch.refresh = false

aFetch.interceptors.request.use(async (c) => {
    //задержка для запросов  во время обновления токенов (для исключения повторного отправления refresh)
    if (!c.url?.includes('/user/auth/refresh/')) {
        while (aFetch.refresh) {
            await sleep(200)
        }
    }

    await getTokensFromDB()

    access_token && (c.headers.Authorization = `Bearer ${access_token}`)
    if (c.url?.includes('/user/auth/remove/') && c.data.refresh_token) {
        await Promise.all([
            DB.delete(StoreName.STORE, ACCESS_TOKEN),
            DB.delete(StoreName.STORE, REFRESH_TOKEN)
        ])
    }
    return c
}, err => console.error(err))


aFetch.interceptors.response.use(
    async (response) => {
        const url = response.config.url || ''
        if (urlWithAuth.includes(url)) {
            const {ok, data} = response.data
            if (ok) {
                saveTokensToDB(data).catch(console.error)
            }
        }
        if (response.data.message === "Unauthorized" && !(response.config as any)._retry) {
            (response.config as any)._retry = true
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

            const response = await axios.post<APIResponseType<UserType>>(baseURL + '/user/auth/refresh/', {refresh_token}, {
                headers: {Authorization: refresh_token ? `Bearer ${refresh_token}` : ''}
            })

            if (response.data.ok) {
            const {data: userAuth} = response.data
                await axios.get(baseURL + '/user/auth/refresh/confirm/', {
                    headers: {
                        Authorization: `Bearer ${userAuth.refresh_token}`,
                    }
                })
                await saveTokensToDB(userAuth)
                return resolve(undefined)
            } else if (window) {
                window.localStorage.removeItem(USER_AUTH)
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
