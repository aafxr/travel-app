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
    subscribe(eventName, callback) {
        if (!this.events.has(eventName))
            this.events.set(eventName, [])

        this.events.get(eventName).push(callback)
        return () => {
            if (this.events.has(eventName)) {
                const callbacks = this.events.get(eventName).filter(cb => cb !== callback)
                this.events.set(eventName, callbacks)
            }
        }
    }

    /**
     * @method
     * @name EventEmitter.emit
     * @param {string} eventName
     * @param {Array} args
     */
    emit(eventName, args = []) {
        if (this.events.has(eventName))
            this.events.get(eventName)
                .forEach(cb => cb(...args))
    }
}