import {ActionName} from "../../types/ActionsType";
import {USER_AUTH} from "../../static/constants";
import {StoreName} from "../../types/StoreName";
import {Action, User} from "../StoreEntities";
import {UserType} from "../../types/UserType";
import {DB} from "../db/DB";
import {openIDBDatabase} from "../db/openIDBDatabaase";

const devUser = {
            id: '12',
            first_name: 'Иван',
            last_name: 'Алексеев'
        }

export class UserService {
    static async getLoggedInUser() {
        if (location.hostname === 'localhost') return new User(devUser)

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
        if(user) return new User(user)
    }
}