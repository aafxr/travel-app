import {ACCESS_TOKEN, REFRESH_TOKEN, USER_AUTH} from "../../static/constants";
import {TelegramAuthPayloadType} from "../../types/TelegramAuthPayloadType";
import {fetchRemoveUserAuth} from "../../api/fetch/fetchRemoveUserAuth";
import {fetchUserAuthTg} from "../../api/fetch/fetchUserAuthTg";
import {openIDBDatabase} from "../db/openIDBDatabaase";
import {ActionName} from "../../types/ActionsType";
import {StoreName} from "../../types/StoreName";
import {Action, User} from "../StoreEntities";
import {UserType} from "../../types/UserType";
import {Photo} from "../StoreEntities/Photo";
import {PhotoService} from "./PhotoService";
import {UserError} from "../errors";
import {Compare} from "../Compare";
import {DB} from "../db/DB";

const devUser = {
    id: 'dev',
    first_name: 'Иван',
    last_name: 'Алексеев'
}


/**
 * сервис для обновления информации о пользователе
 *
 * ---
 * доступны следующие методы:
 * - getLoggedInUser
 * - create
 * - update
 * - delete
 * - getById
 * - logIn
 * - logOut
 * - writeTransaction
 */
export class UserService {

    /**
     * метод загружает информацию о последнем пользователе, который был авторизован
     */
    static async getLoggedInUser() {
        if (location.hostname === 'localhost') {
            const dev_user = await DB.getOne<UserType>(StoreName.USERS, devUser.id)
            if (!dev_user) await DB.add(StoreName.USERS, devUser)
            const user = new User(dev_user || devUser)
            if (user.photo) {
                const pt = await PhotoService.getById(user.photo)
                if (pt) user.setPhoto(new Photo(pt))
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

    /**
     * метод позволяет создать нового пользователя и генерирует action
     * @param user
     */
    static async create(user: Partial<UserType> | undefined) {
        const newUser = user ? new User(user) : new User({})
        const action = new Action(newUser, newUser.id, StoreName.USERS, ActionName.ADD)
        await UserService.writeTransaction(newUser, action)
        return newUser
    }

    /**
     * метод позволяет обновить информацию о пользователе и генерирует action
     * @param user
     */
    static async update(user: User) {
        if (user.image) await PhotoService.save(user.image)

        const oldUser = await DB.getOne<User>(StoreName.USERS, user.id)

        if (!oldUser) throw UserError.updateBeforeCreate()

        const changed = Compare.objects(oldUser, user, ['id'])

        const action = new Action(changed, user.id, StoreName.USERS, ActionName.UPDATE)
        await UserService.writeTransaction(user, action)
        return user
    }

    /**
     * метод позволяет удалить информацию о пользователе из бд и генерирует action
     * @param user
     */
    static async delete(user: User) {
        const action = new Action({id: user.id}, user.id, StoreName.USERS, ActionName.DELETE)
        await UserService.writeTransaction(user, action, true)
    }

    /**
     * метод позволяет загрузить информацию о пользователе о пользователе
     * @param id
     */
    static async getById(id: string) {
        const user = await DB.getOne<UserType>(StoreName.USERS, id)
        if (user) {
            const userInstance = new User(user)
            if (user.photo) {
                const photo = await PhotoService.getById(user.photo)
                if (photo) userInstance.setPhoto(new Photo(photo))
            }
            return userInstance
        }
    }

    /**
     * метод получает информацию о пользователе от сервиса telegramAuthWidget и формирует запрос к апи для прохождения
     * процедуры аутентификации. Затем, в случае успешной верификации, сохраняет информацию в бд
     * @param authPayload информацию от telegramAuthWidget
     */
    static async logIn(authPayload: TelegramAuthPayloadType) {
        const user = await fetchUserAuthTg(authPayload)
        if (user) {
            await DB.update(StoreName.USERS, user)
            await DB.update(StoreName.STORE, {name: ACCESS_TOKEN, value: user.token})
            await DB.update(StoreName.STORE, {name: REFRESH_TOKEN, value: user.refresh_token})
            localStorage.setItem(USER_AUTH, JSON.stringify(user))
        }
        return user

    }

    /**
     * метод удаляет информацию о залогиненом пользователе
     * @param user
     */
    static async logOut(user: User) {
        localStorage.removeItem(USER_AUTH)
        await DB.delete(StoreName.USERS, user.id)
        await DB.delete(StoreName.STORE, ACCESS_TOKEN)
        await DB.delete(StoreName.STORE, REFRESH_TOKEN)
        await fetchRemoveUserAuth(user)
    }

    static async writeTransaction(user:User, action: Action<Partial<User>>, isDelete = false){
        const db = await openIDBDatabase()
        const tx = db.transaction([StoreName.USERS, StoreName.ACTION], 'readwrite')
        const userStore = tx.objectStore(StoreName.USERS)
        const actionStore = tx.objectStore(StoreName.ACTION)
        isDelete
            ? userStore.delete(user.id)
            : userStore.put(user)
        actionStore.add(action)
    }
}