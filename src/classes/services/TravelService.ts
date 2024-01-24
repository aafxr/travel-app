import {Action, Travel, User} from "../StoreEntities";
import {StoreName} from "../../types/StoreName";
import {ActionName} from "../../types/ActionsType";
import {DB} from "../../db/DB";
import {TravelType} from "../../types/TravelType";
import {fetchTravels} from "../../api/fetch/fetchTravels";

export class TravelService {
    static async create(owner: User) {
        const travel = new Travel({owner_id: owner.id})
        const action = new Action(travel, owner.id, StoreName.TRAVEL, ActionName.ADD)
        const tx = await DB.transaction([StoreName.ACTION, StoreName.TRAVEL])
        const travelStore = tx.objectStore(StoreName.TRAVEL)
        const actionStore = tx.objectStore(StoreName.ACTION)
        travelStore.add(travel.dto())
        actionStore.add(action.dto())
        return travel
    }

    static async update(travel: Travel, user: User) {
        const action = new Action(travel, user.id, StoreName.TRAVEL, ActionName.UPDATE)
        await DB.writeAll([travel, action])
        return travel
    }

    static async delete(travel: Travel, user: User) {
        const action = new Action(travel, user.id, StoreName.TRAVEL, ActionName.DELETE)
        const tx = await DB.transaction([StoreName.ACTION, StoreName.TRAVEL])
        const travelStore = tx.objectStore(StoreName.TRAVEL)
        const actionStore = tx.objectStore(StoreName.ACTION)
        travelStore.delete(travel.id)
        actionStore.add(action.dto())
    }

    static async getById(travelId: string) {
        const travel = await DB.getOne<TravelType>(StoreName.TRAVEL, travelId)
        if (travel) return new Travel(travel)
        return
    }

    static async getList(max?: number) {
        const fetchTravelsList = await fetchTravels()
        if (fetchTravelsList.length) return fetchTravelsList

        const localTravelsList = await DB.getAll<TravelType>(StoreName.TRAVEL, max)
        return localTravelsList.map(ltl => new Travel(ltl))
    }
}


class tmp {
    static async create() {
    }

    static async update() {
    }

    static async delete() {
    }
}