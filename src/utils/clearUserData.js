import constants, {ACCESS_TOKEN, REFRESH_TOKEN, USER_AUTH} from "../static/constants";
import storeDB from "../db/storeDB/storeDB";
import ErrorReport from "../controllers/ErrorReport";

/**
 * Данный метод преднозначен для очистки данных ксли пользователь не авторизован
 */
export default function clearUserData(){
    if (window) {
        window?.location.reload()
        window?.localStorage.setItem(USER_AUTH, null)
    }
    Promise.all([
        storeDB.removeElement(constants.store.STORE, ACCESS_TOKEN),
        storeDB.removeElement(constants.store.STORE, REFRESH_TOKEN)
    ])
        .catch(err => {
            console.error(err)
            // ErrorReport.sendError(err)
        })
}