import {Place, Travel, User} from "./classes/StoreEntities";
import {DB} from "./classes/db/DB";
import {Context} from "./classes/Context/Context";
import ymaps from "ymaps/index";


declare global {


    interface Window {
        Travel: Travel.prototype
        travel: Travel
        Place: Place.prototype
        Expense: Expense.prototype
        User:User.prototype
        context: Context
        DB: DB
        Recover: Recover
        TelegramLoginWidget: {
            dataOnauth: (user) => unknown,
        }
        ymaps:ymaps,
        socket: WebSocket
    }

    interface GlobalEventHandlersEventMap{
        'expense': Event
    }
}
