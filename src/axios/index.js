import axios from 'axios'
import constants, {ACCESS_TOKEN, REFRESH_TOKEN} from "../static/constants";
import storeDB from "../db/storeDB/storeDB";

const baseURL = process.env.REACT_APP_SERVER_URL


const aFetch = axios.create({
    baseURL,
    timeout: 2000,
});

let access_token
let refresh_token


async function getTokensFromDB(){
    await Promise.all([
        storeDB.getElement(constants.store.STORE, ACCESS_TOKEN).then(res => access_token = res[0]?.value),
        storeDB.getElement(constants.store.STORE, REFRESH_TOKEN).then(res => refresh_token = res[0]?.value)
    ])
        .then(() => console.log({access_token, refresh_token}))
        .catch(console.error)
}

getTokensFromDB()


aFetch.interceptors.request.use(async (c) => {
    if(!access_token) {
        await getTokensFromDB()
    }
    console.log('[axios] ===> ', c.url)
    console.log('[axios] Authorization ===> ', c.headers.Authorization)
    c.headers.Authorization = access_token ? `Bearer ${access_token}` : '';
    return c;
}, err => console.error(err))


aFetch.interceptors.response.use(response => {
    const url = response.config.url
    if (url.includes('/user/auth/')) {
        const {ok, data} = response.data
        if (ok) {
            access_token = data.token
            refresh_token = data.refresh_token
            Promise.all([
                storeDB.editElement(constants.store.STORE, {name: ACCESS_TOKEN, value: access_token}),
                storeDB.editElement(constants.store.STORE, {name: REFRESH_TOKEN, value: refresh_token})
            ])
                .then(() => console.log({access_token, refresh_token}))
                .catch(console.error)
        }
    }
    return response
})


aFetch.interceptors.response.use(c => c, err => {
    const originalRequest = err.config;

    console.log(err)
    if (err.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        return axios.get(baseURL + '/user/auth/refresh/').then((response) => {
            const {ok, data: userAuth, message} = response.data
            console.log(userAuth)
            if (ok) {
                originalRequest.headers['Authorization'] = `Bearer ${userAuth.token}`;
                return aFetch(originalRequest);
            }
            throw new Error(message)
        });
    }
    return Promise.reject(err);
})

export default aFetch
