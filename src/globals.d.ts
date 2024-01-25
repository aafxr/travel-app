import {Place, Travel, User} from "./classes/StoreEntities";
import {DB} from "./classes/db/DB";
import {Context} from "./classes/Context/Context";


declare global {


    interface Window {
        Travel: Travel.prototype
        travel: Travel
        Place: Place.prototype
        User:User.prototype
        context: Context
        DB: DB
        TelegramLoginWidget: {
            dataOnauth: (user) => unknown,
        }
    }
}
