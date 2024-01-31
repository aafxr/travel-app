import {pushAlertMessage} from "../../components/Alerts/Alerts";
import ErrorReport from "../../controllers/ErrorReport";
import {StoreName} from "../../types/StoreName";
import {DB} from "../../classes/db/DB";


function saveErrorToDB(e: Error) {
    const item = {time: Date.now(), error: e}
    DB.add(StoreName.ERRORS, item).catch(console.error)
}


/**
 * отправка сообщения об ошибке
 * @function
 * @name defaultHandleError
 * @param {Error} err ошибка, отправляется на сервер
 * @param {string} [message] сообщение будет выводиться вместо дефлтного
 * @category Utils
 */
export default function defaultHandleError(err: Error, message?: string) {
    if (err.message.match(/Failed to fetch/i)) {
        pushAlertMessage({type: "info", message: 'Проверьте подключение к интернету'})
    } else {
        ErrorReport.sendError(err).catch(console.error)
        pushAlertMessage({type: "info", message: message || err.message})
        saveErrorToDB(err)
    }
    console.error(err)
}
