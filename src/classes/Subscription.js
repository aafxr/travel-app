/**
 * класс реализует управление подписками
 *
 * @class
 * @name Subscription
 * @template T
 */
export default class Subscription{
    /**@type{function[]}*/
    _subs

    constructor() {
        this._subs = []
    }


    /**
     * Добавить подписку
     * @method
     * @name Subscription.on
     * @param {(value: T) => unknown} cb
     * @returns {Subscription}
     */
    on(cb){
        if(typeof cb === 'function' && !this._subs.includes(cb)){
            this._subs.push(cb)
        }
        return this
    }

    /**
     * Удалить подписку
     * @method
     * @name Subscription.off
     * @param {(value: T) => unknown} cb
     * @returns {Subscription}
     */
    off(cb){
        if(typeof cb === 'function'){
            this._subs = this._subs.filter( s => s !==cb)
        }
        return this
    }

    /**
     * Отправить подписчикам payload
     * @method
     * @name Subscription.dispatch
     * @param {T} payload
     * @returns {Subscription}
     */
    dispatch(payload){
        this._subs.forEach(s => s(payload))
        return this
    }
}