interface EventEmitterCallbackType<T>{
    (value: T) :unknown
}
/**
 * класс позволяет уведомлять передавать подписчикам данные
 *
 *
 * - метод __subscribe__ позволяет подписаться на событие и получать актуальные данные.
 * Метод возвращает callback __unsubscribe__, который позволяет отисаться от события.
 * unsubscribe должен вызываться при уничтожение компонента (подписчика)
 *
 *
 * - метод __emit__ позволяет генерировать событие, которое будет вызывать всех подписчиков
 */
export default class EventEmitter {
    events:Map<string, EventEmitterCallbackType<this>[]>
    constructor() {
        this.events = new Map()
    }

    /**
     * @method
     * @name EventEmitter.subscribe
     * @param {string} eventName
     * @param {Function} callback
     * @return {() => unknown}
     */
    subscribe(eventName: string, callback: EventEmitterCallbackType<this>) {
        if (!this.events.has(eventName))
            this.events.set(eventName, [])

        this.events.get(eventName)!.push(callback)
        return function(this: EventEmitter) {
            console.warn(this)
            if (this.events.has(eventName)) {
                const callbacks = this.events.get(eventName)!.filter(cb => cb !== callback)
                this.events.set(eventName, callbacks)
            }
        }.bind(this)
    }

    /**
     * @method
     * @name EventEmitter.emit
     * @param {string} eventName
     */
    emit(eventName: string) {
        console.log(this)
        if (this.events.has(eventName))
            this.events.get(eventName)!
                .forEach(cb => cb(this))
    }
}