import {fetchRouteAdvice} from "../../api/fetch/fetchRouteAdvice";
import {fetchTravels} from "../../api/fetch/fetchTravels";
import {openIDBDatabase} from "../db/openIDBDatabaase";
import {Action, Travel, User} from "../StoreEntities";
import {ActionName} from "../../types/ActionsType";
import {TravelError, UserError} from "../errors";
import {StoreName} from "../../types/StoreName";
import {Compare} from "../Compare";
import {DB} from "../db/DB";
import {Context} from "../Context/Context";


/**
 * сервис позволяет работать с путешествиями
 * (создавать, обновлять, удалять, получать список путешествий )
 *
 * ---
 * доступны следующие методы:
 * - create
 * - update
 * - delete
 * - getById
 * - getList
 * - getRecommendRoutes
 * - writeTransaction
 */
export class TravelService {

    /**
     * метод позволяет создать новое путешествие, так же сгенерировать
     * соответствующий action
     * @param context
     * @param newTravel
     * @param user
     */
    static async create(context: Context, newTravel: Travel, user: User) {
        if (!User.isLogIn(user)) throw UserError.unauthorized()

        const owner = user
        const travel = new Travel({...newTravel, owner_id: owner.id})
        const action = new Action(travel, owner.id, StoreName.TRAVEL, ActionName.ADD)
        await TravelService.writeTransaction(travel, action)
        context.socket?.emit('travel:action', action)

        return travel
    }

    /**
     * метод позволяет обновить путешествие, так же генерирет action с измененными полями путешествия
     * @param context
     * @param travel
     * @param user
     */
    static async update(context: Context, travel: Travel, user: User) {
        if (!user || !Travel.permitChange(travel, user)) throw TravelError.permissionDeniedToChangeTravel()
        if (!Travel.permitChange(travel, user)) throw TravelError.permissionDeniedToChangeTravel()

        // if (travel.image) await PhotoService.save(travel.image)
        const oldTravel = await DB.getOne<Travel>(StoreName.TRAVEL, travel.id)

        if(!oldTravel) throw TravelError.updateBeforeCreate()

        const change = Compare.travels(oldTravel, travel, ["id"])

        const action = new Action(change, user.id, StoreName.TRAVEL, ActionName.UPDATE)

        await TravelService.writeTransaction(travel, action)
        context.socket?.emit('travel:action', action)

        return travel
    }

    /**
     * метод позволяет удалить путешествие из локальной бд, также генерирует соответствующий action
     * @param context
     * @param travel
     * @param user
     */
    static async delete(context: Context, travel: Travel, user: User) {
        if (!user) throw UserError.unauthorized()
        if (!Travel.permitDelete(travel, user)) throw TravelError.permissionDeniedDeleteTravel()

        const {id} = travel

        const action = new Action({id}, user.id, StoreName.TRAVEL, ActionName.DELETE)
        await TravelService.writeTransaction(travel, action, true)
        context.socket?.emit('travel:action', action)
    }

    /**
     * метод позволяет загрузить информацию о путешествии из локальной бд
     * @param travelId
     */
    static async getById(travelId: string) {
        const travel_type = await DB.getOne<Travel>(StoreName.TRAVEL, travelId)
        if (travel_type) {
            return new Travel(travel_type)
        }
    }

    /**
     * метод позволяет загрузить информацию о списке путешествий из локальной бд
     * @param max
     */
    static async getList(max?: number) {
        const fetchTravelsList = await fetchTravels()
        if (fetchTravelsList.length) {
            for(const fetchTravel of fetchTravelsList){
                try {
                    await DB.add(StoreName.TRAVEL, fetchTravel)
                }catch(_){}
            }
            // await DB.writeAllToStore(StoreName.TRAVEL, fetchTravelsList)
            return fetchTravelsList
        }

        const idb_travels = await DB.getAll<Travel>(StoreName.TRAVEL, max)
        return idb_travels.map(t => new Travel(t))
    }

    /**
     * метод выполняет обращение к api и получает наиболее подходящий маршрут по выбранным предпочтениям
     * @param travel
     */
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

    static async writeTransaction(travel:Travel, action: Action<Partial<Travel>>, isDelete = false){
        const db = await openIDBDatabase()
        const tx = db.transaction([StoreName.TRAVEL, StoreName.ACTION], 'readwrite')
        const travelStore = tx.objectStore(StoreName.TRAVEL)
        const actionStore = tx.objectStore(StoreName.ACTION)
        isDelete
            ? travelStore.delete(travel.id)
            : travelStore.put(travel)
        actionStore.add(action)
    }

}
