import {fetchTravels} from "../../api/fetch/fetchTravels";
import {Action, Place, Travel, User} from "../StoreEntities";
import {openIDBDatabase} from "../db/openIDBDatabaase";
import {ActionName} from "../../types/ActionsType";
import {TravelType} from "../../types/TravelType";
import {StoreName} from "../../types/StoreName";
import {UserError} from "../errors/";
import {Photo} from "../StoreEntities/Photo";
import {PhotoService} from "./PhotoService";
import {Context} from "../Context/Context";
import {TravelError} from "../errors";
import {DB} from "../db/DB";

export class TravelService {
    static async create(newTravel: Travel, user: User) {
        if (!user.isLogIn()) throw UserError.unauthorized()

        const owner = user
        const travel = new Travel({...newTravel, owner_id: owner.id})
        const action = new Action(travel, owner.id, StoreName.TRAVEL, ActionName.ADD)
        const db = await openIDBDatabase()
        const tx = db.transaction([StoreName.ACTION, StoreName.TRAVEL], "readwrite")
        const travelStore = tx.objectStore(StoreName.TRAVEL)
        const actionStore = tx.objectStore(StoreName.ACTION)
        travelStore.add(travel.dto())
        actionStore.add(action.dto())
        return travel
    }

    static async update(travel: Travel, user: User) {
        if (!user || !travel.permitChange(user)) throw TravelError.permissionDeniedToChangeTravel()
        if (!travel.permitChange(user)) throw TravelError.permissionDeniedToChangeTravel()

        if (travel.image) await PhotoService.save(travel.image)
        const action = new Action(travel, user.id, StoreName.TRAVEL, ActionName.UPDATE)
        await DB.writeAll([travel, action])
        return travel
    }

    static async delete(travel: Travel, user: User) {
        if (!user) throw UserError.unauthorized()
        if (!travel.permitDelete(user)) throw TravelError.permissionDeniedDeleteTravel()

        const action = new Action(travel, user.id, StoreName.TRAVEL, ActionName.DELETE)
        const db = await openIDBDatabase()
        const tx = db.transaction([StoreName.TRAVEL, StoreName.ACTION], 'readwrite')
        const travelStore = tx.objectStore(StoreName.TRAVEL)
        const actionStore = tx.objectStore(StoreName.ACTION)
        travelStore.delete(travel.id)
        actionStore.add(action.dto())
    }

    static async getById(travelId: string) {
        const travel_type = await DB.getOne<TravelType>(StoreName.TRAVEL, travelId)
        if (travel_type) {
            const travel = new Travel(travel_type)
            if (travel.photo) {
                const photo = await PhotoService.getById(travel.photo)
                if (photo) Travel.setPhoto(travel, new Photo(photo))
            }
            return travel
        }
    }

    static async getList(max?: number) {
        const fetchTravelsList = await fetchTravels()
        if (fetchTravelsList.length) {
            for (const travel of fetchTravelsList) {
                const photo = await PhotoService.getById(travel.photo)
                if (photo) Travel.setPhoto(travel, new Photo(photo))
            }
            return fetchTravelsList
        }
        const idb_travels = await DB.getAll<TravelType>(StoreName.TRAVEL)
        const travels = idb_travels.map(t => new Travel(t))
        for (const travel of travels) {
            const photo = await PhotoService.getById(travel.photo)
            if (photo) Travel.setPhoto(travel, new Photo(photo))
        }
        return travels
    }

    static async addPlace(ctx: Context, place: Place) {
        const {user, travel} = ctx
        if (!travel) throw TravelError.unexpectedTravelId('undefined')
        if (!user || !travel.permitChange(user)) throw TravelError.permissionDeniedToChangeTravel()
        if (!place || place.id) throw TravelError.unexpectedPlace(place?.id)

        Travel.setPlaces(travel, [...travel.places, place])
        return await TravelService.update(travel, user)
    }

    static async addPlaces(ctx: Context, travel: Travel, places: Place[]) {
        const user = ctx.user

        if (!user) throw UserError.unauthorized()
        if (!travel.permitChange(user)) throw TravelError.permissionDeniedToChangeTravel()

        Travel.setPlaces(travel, [...travel.places, ...places])
        await TravelService.update(travel, user)
    }

}
