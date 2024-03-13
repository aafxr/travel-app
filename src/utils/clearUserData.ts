import {ACCESS_TOKEN, REFRESH_TOKEN, USER_AUTH} from "../static/constants";
import {StoreName} from "../types/StoreName";
import {DB} from '../classes/db/DB'

/**
 * Данный метод преднозначен для очистки данных ксли пользователь не авторизован
 * @function
 * @name clearUserData
 * @category Utils
 */
export default function clearUserData(){
    if ('localStorage' in  window) {
        // window?.location.reload()
        window?.localStorage.removeItem(USER_AUTH)
    }
    Promise.all([
        DB.delete(StoreName.STORE, ACCESS_TOKEN),
        DB.delete(StoreName.STORE, REFRESH_TOKEN)
    ])
        .catch(err => {
            console.error(err)
        })
}