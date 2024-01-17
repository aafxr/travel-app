interface SubscriptionCallbackType<T>{
    (value: T) :unknown
}
/**
 * класс реализует управление подписками
 */
export default class Subscription<T>{
    _subs: SubscriptionCallbackType<T>[] = []

    constructor() {
        this._subs = []
    }


    /**
     * Добавить подписку
     */
    on(cb:SubscriptionCallbackType<T>){
        if(!this._subs.includes(cb)){
            this._subs.push(cb)
        }
        return this
    }

    /**
     * Удалить подписку
     */
    off(cb: SubscriptionCallbackType<T>){
        if(typeof cb === 'function'){
            this._subs = this._subs.filter( s => s !==cb)
        }
        return this
    }



    /**
     * Отправить подписчикам payload
     */
    dispatch(payload: T){
        this._subs.forEach(s => s(payload))
        return this
    }
}