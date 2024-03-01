import {fetchRouteAdvice} from "../../api/fetch/fetchRouteAdvice";
import {fetchTravels} from "../../api/fetch/fetchTravels";
import {openIDBDatabase} from "../db/openIDBDatabaase";
import {Action, Travel, User} from "../StoreEntities";
import {ActionName} from "../../types/ActionsType";
import {TravelError, UserError} from "../errors";
import {StoreName} from "../../types/StoreName";
import {Compare} from "../Compare";
import {DB} from "../db/DB";

export class TravelService {
    static async create(newTravel: Travel, user: User) {
        if (!User.isLogIn(user)) throw UserError.unauthorized()

        const owner = user
        const travel = new Travel({...newTravel, owner_id: owner.id})
        const action = new Action(travel, owner.id, StoreName.TRAVEL, ActionName.ADD)
        const db = await openIDBDatabase()
        const tx = db.transaction([StoreName.ACTION, StoreName.TRAVEL], "readwrite")
        const travelStore = tx.objectStore(StoreName.TRAVEL)
        const actionStore = tx.objectStore(StoreName.ACTION)
        travelStore.add(travel)
        actionStore.add(action)
        return travel
    }

    static async update(travel: Travel, user: User) {
        if (!user || !travel.permitChange(user)) throw TravelError.permissionDeniedToChangeTravel()
        if (!travel.permitChange(user)) throw TravelError.permissionDeniedToChangeTravel()

        // if (travel.image) await PhotoService.save(travel.image)
        const oldTravel = await DB.getOne<Travel>(StoreName.TRAVEL, travel.id)

        if(!oldTravel) throw TravelError.updateBeforeCreate()

        const change = Compare.travels(oldTravel, travel, ["id"])

        const action = new Action(change, user.id, StoreName.TRAVEL, ActionName.UPDATE)

        const db = await openIDBDatabase()
        const tx = db.transaction([StoreName.TRAVEL, StoreName.ACTION], 'readwrite')
        const travelStore = tx.objectStore(StoreName.TRAVEL)
        const actionStore = tx.objectStore(StoreName.ACTION)
        travelStore.put(travel)
        actionStore.add(action)

        // await DB.writeWithAction(StoreName.TRAVEL, travel, user.id, ActionName.UPDATE)
        return travel
    }

    static async delete(travel: Travel, user: User) {
        if (!user) throw UserError.unauthorized()
        if (!travel.permitDelete(user)) throw TravelError.permissionDeniedDeleteTravel()

        const {id} = travel

        const action = new Action({id}, user.id, StoreName.TRAVEL, ActionName.DELETE)
        const db = await openIDBDatabase()
        const tx = db.transaction([StoreName.TRAVEL, StoreName.ACTION], 'readwrite')
        const travelStore = tx.objectStore(StoreName.TRAVEL)
        const actionStore = tx.objectStore(StoreName.ACTION)
        travelStore.delete(travel.id)
        actionStore.add(action)
    }

    static async getById(travelId: string) {
        const travel_type = await DB.getOne<Travel>(StoreName.TRAVEL, travelId)
        if (travel_type) {
            return new Travel(travel_type)
        }
    }

    static async getList(max?: number) {
        const fetchTravelsList = await fetchTravels()
        if (fetchTravelsList.length) return fetchTravelsList

        const idb_travels = await DB.getAll<Travel>(StoreName.TRAVEL, max)
        return idb_travels.map(t => new Travel(t))
    }

    static async getRecommendRoutes(travel:Travel){
        try {
            return await fetchRouteAdvice({
                days: travel.days,
                depth: travel.preference.depth,
                density: travel.preference.density,
                location: 1,
                preference: {...travel.preference.interests},
            })
        } catch (e){
            console.error(e)
            return []
        }
    }

    // static async addPlace(ctx: Context, place: Place) {
    //     const {user, travel} = ctx
    //     if (!travel) throw TravelError.unexpectedTravelId('undefined')
    //     if (!user || !travel.permitChange(user)) throw TravelError.permissionDeniedToChangeTravel()
    //     if (!place || place.id) throw TravelError.unexpectedPlace(place?.id)
    //
    //     travel.setPlaces([...travel.places, place])
    //     return await TravelService.update(travel, user)
    // }

    // static async addPlaces(ctx: Context, travel: Travel, places: Place[]) {
    //     const user = ctx.user
    //
    //     if (!user) throw UserError.unauthorized()
    //     if (!travel.permitChange(user)) throw TravelError.permissionDeniedToChangeTravel()
    //
    //     travel.setPlaces([...travel.places, ...places])
    //     await TravelService.update(travel, user)
    // }

}
