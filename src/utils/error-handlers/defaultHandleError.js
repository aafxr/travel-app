import {pushAlertMessage} from "../../components/Alerts/Alerts";
import ErrorReport from "../../controllers/ErrorReport";

/**
 * отправка сообщения об ошибке
 * @function
 * @name defaultHandleError
 * @param {Error} err ошибка, отправляется на сервер
 * @param {string} [message] сообщение будет выводиться вместо дефлтного
 * @category Utils
 */
export default function defaultHandleError(err, message){
    if(err instanceof Error){
        console.error(err)
        const defaultMessage = 'Произошла ошибка'
        if (err.message.match(/Failed to fetch/i)){
            pushAlertMessage({type:"info", message: 'Проверьте подключение к интернету'})
        } else {
            ErrorReport.sendError(err).catch(console.error)
            pushAlertMessage({type:"info", message: message || defaultMessage})
        }
    }
}
