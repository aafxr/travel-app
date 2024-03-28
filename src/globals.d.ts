import {Place, Travel, User} from "./classes/StoreEntities";
import {Context} from "./classes/Context/Context";
import {Socket} from "socket.io-client";
import {DB} from "./classes/db/DB";
import ymaps from "ymaps/index";
import {Compare} from "./classes/Compare";


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
        socket: Socket
        sendMessage: function
        Compare: Compare
    }

    interface GlobalEventHandlersEventMap{
        'expense': Event
    }
}
