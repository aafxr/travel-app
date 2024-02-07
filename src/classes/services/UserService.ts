import {ActionName} from "../../types/ActionsType";
import {ACCESS_TOKEN, REFRESH_TOKEN, USER_AUTH} from "../../static/constants";
import {TelegramAuthPayloadType} from "../../types/TelegramAuthPayloadType";
import {fetchRemoveUserAuth} from "../../api/fetch/fetchRemoveUserAuth";
import {fetchUserAuthTg} from "../../api/fetch/fetchUserAuthTg";
import {openIDBDatabase} from "../db/openIDBDatabaase";
import {StoreName} from "../../types/StoreName";
import {Action, User} from "../StoreEntities";
import {UserType} from "../../types/UserType";
import {Photo} from "../StoreEntities/Photo";
import {PhotoService} from "./PhotoService";
import {DB} from "../db/DB";

const devUser = {
    id: 'dev',
    first_name: 'Иван',
    last_name: 'Алексеев'
}

export class UserService {
    static async getLoggedInUser() {
        if (location.hostname === 'localhost') {
            const dev_user = await DB.getOne<UserType>(StoreName.USERS, devUser.id)
            if (!dev_user) await DB.add(StoreName.USERS, devUser)
            const user = new User(dev_user || devUser)
            if (user.photo) {
                const pt = await PhotoService.getById(user.photo)
                if (pt) User.setPhoto(user, new Photo(pt))
            }
            return user
        }

        if ('localStorage' in global) {
            try {
                const ls_user = JSON.parse(localStorage.getItem(USER_AUTH) || '')
                if (ls_user) return new User(ls_user)
            } catch (e) {
            }
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
        if (user.image) await PhotoService.save(user.image)
        const action = new Action(user, user.id, StoreName.TRAVEL, ActionName.UPDATE)
        await DB.writeAll([user, action])
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

    static async getById(id: string) {
        const user = await DB.getOne<UserType>(StoreName.USERS, id)
        if (user) {
            const userInstance = new User(user)
            if (user.photo) {
                const photo = await PhotoService.getById(user.photo)
                if (photo) User.setPhoto(userInstance, new Photo(photo))
            }
            return userInstance
        }
    }

    static async logIn(authPayload: TelegramAuthPayloadType) {
        const user = await fetchUserAuthTg(authPayload)
        if (user) {
            await DB.update(StoreName.USERS, user.dto())
            await DB.update(StoreName.STORE, {name: ACCESS_TOKEN, value: user.token})
            await DB.update(StoreName.STORE, {name: REFRESH_TOKEN, value: user.refresh_token})
            localStorage.setItem(USER_AUTH, JSON.stringify(user.dto()))
        }
        return user

    }

    static async logOut(user: User) {
        localStorage.removeItem(USER_AUTH)
        await DB.delete(StoreName.USERS, user.id)
        await DB.delete(StoreName.STORE, ACCESS_TOKEN)
        await DB.delete(StoreName.STORE, REFRESH_TOKEN)
        await fetchRemoveUserAuth(user)
    }
}