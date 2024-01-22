import {Place, Travel, User} from "./classes/StoreEntities";
import {DB} from "./db/DB";


declare global {
    interface Window {
        Travel: Travel.prototype
        travel: Travel
        Place: Place.prototype
        User:User.prototype
        DB: DB
        TelegramLoginWidget: {
            dataOnauth: (user) => unknown,
        }
    }
}
