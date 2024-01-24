import {ActionName} from "../../types/ActionsType";
import {USER_AUTH} from "../../static/constants";
import {StoreName} from "../../types/StoreName";
import {Action, User} from "../StoreEntities";
import {UserType} from "../../types/UserType";
import {DB} from "../../db/DB";

export class UserService {
    static async getlogiedInUser() {
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
        const tx = await DB.transaction([StoreName.USERS, StoreName.ACTION])
        const userStore = tx.objectStore(StoreName.USERS)
        const actionStore = tx.objectStore(StoreName.ACTION)
        userStore.add(newUser.dto())
        actionStore.add(action.dto())
        return newUser

    }

    static async update(user: User) {
        const action = new Action(user, user.id, StoreName.USERS, ActionName.UPDATE)
        const tx = await DB.transaction([StoreName.USERS, StoreName.ACTION])
        const userStore = tx.objectStore(StoreName.USERS)
        const actionStore = tx.objectStore(StoreName.ACTION)
        userStore.add(user.dto())
        actionStore.add(action.dto())
        return user
    }

    static async delete(user: User) {
        const action = new Action(user, user.id, StoreName.USERS, ActionName.DELETE)
        const tx = await DB.transaction([StoreName.ACTION, StoreName.USERS])
        const userStore = tx.objectStore(StoreName.USERS)
        const actionStore = tx.objectStore(StoreName.ACTION)
        userStore.delete(user.id)
        actionStore.add(action.dto())
    }
}