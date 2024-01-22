import {Place, Travel} from "./classes/StoreEntities";
import {DB} from "./db/DB";


declare global {
    interface Window {
        Travel: Travel.prototype
        Place: Place.prototype
        DB: DB
    }
}
