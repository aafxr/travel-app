import {ActionName} from "../../types/ActionsType";
import {USER_AUTH} from "../../static/constants";
import {StoreName} from "../../types/StoreName";
import {Action, User} from "../StoreEntities";
import {UserType} from "../../types/UserType";
import {DB} from "../db/DB";
import {openIDBDatabase} from "../db/openIDBDatabaase";
import {PhotoService} from "./PhotoService";
import {Photo} from "../StoreEntities/Photo";

const devUser = {
            id: '12',
            first_name: 'Иван',
            last_name: 'Алексеев'
        }

export class UserService {
    static async getLoggedInUser() {
        if (location.hostname === 'localhost') {
            const dev_user = await DB.getOne<UserType>(StoreName.USERS, devUser.id)
            const user = new User(dev_user || devUser)
            if (user.photo) {
                const pt = await PhotoService.getById(user.photo)
                if(pt) user.setPhoto(new Photo(pt))
            }
            return user
        }

        if ('localStorage' in global) {
            try {
                const ls_user = JSON.parse(localStorage.getItem(USER_AUTH) || '')
                if (ls_user) return new User(ls_user)
            } catch (e) {}
        }
        return null
    }

    static async create(user: Partial<UserType> | undefined) {
        const newUser = user ? new User(user) : new User({})
        const action = new Action(newUser, newUser.id, StoreName.USERS, ActionName.ADD)
        const db = await openIDBDatabase()
        const tx = db.transaction([StoreName.USERS, StoreName.ACTION], 'readwrite')
        const userStore = tx.objectStore(StoreName.USERS)
        const actionStore = tx.objectStore(StoreName.ACTION)
        userStore.add(newUser.dto())
        actionStore.add(action.dto())
        return newUser

    }

    static async update(user: User) {
        const action = new Action(user, user.id, StoreName.USERS, ActionName.UPDATE)
        const db = await openIDBDatabase()
        const tx = db.transaction([StoreName.USERS, StoreName.ACTION], 'readwrite')
        const userStore = tx.objectStore(StoreName.USERS)
        const actionStore = tx.objectStore(StoreName.ACTION)
        userStore.put(user.dto())
        actionStore.add(action.dto())
        return user
    }

    static async delete(user: User) {
        const action = new Action(user, user.id, StoreName.USERS, ActionName.DELETE)
        const db = await openIDBDatabase()
        const tx = db.transaction([StoreName.USERS, StoreName.ACTION], 'readwrite')
        const userStore = tx.objectStore(StoreName.USERS)
        const actionStore = tx.objectStore(StoreName.ACTION)
        userStore.delete(user.id)
        actionStore.add(action.dto())
    }

    static async getById(id:string){
        const user = await DB.getOne<UserType>(StoreName.USERS, id)
        if(user) {
            const userInstance = new User(user)
            if(user.photo) {
                const photo = await PhotoService.getById(user.photo)
                if(photo) userInstance.setPhoto(new Photo(photo))
            }
            return userInstance
        }
    }
}