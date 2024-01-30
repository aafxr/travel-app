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
    events: Map<string, ((ctx: this) => unknown)[]>
    upd:number

    constructor() {
        this.events = new Map()
        this.upd = -1
    }

    /**
     * @method
     * @name EventEmitter.subscribe
     * @param {string} eventName
     * @param {Function} callback
     * @return {() => unknown}
     */
    subscribe<T extends keyof this & string>(eventName: T | string, callback: (ctx: this) => unknown) {
        if (!this.events.has(eventName))
            this.events.set(eventName, [])

        this.events.get(eventName)!.push(callback)

        return () => {
            if (this.events.has(eventName)) {
                const callbacks = this.events.get(eventName)!.filter(cb => cb !== callback)
                this.events.set(eventName, callbacks)
            }
        }
    }

    /**
     * @method
     * @name EventEmitter.emit
     * @param {string} eventName
     * @param that
     */
    emit<T extends keyof this & string>(eventName: T | string, that: this[]) {
        const callbacks = this.events.get(eventName)
        if (callbacks) callbacks.forEach(cb => cb(that[0]))
    }
}