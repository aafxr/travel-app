import debounce from "lodash.debounce";
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
    events:Map<string, ((ctx:this) => unknown)[]>
    constructor() {
        this.events = new Map()
        // this.emit =this.emit.bind(this)// debounce(this.emit,100,{trailing:true}).bind(this)
    }

    /**
     * @method
     * @name EventEmitter.subscribe
     * @param {string} eventName
     * @param {Function} callback
     * @return {() => unknown}
     */
    subscribe(eventName: string, callback: (ctx:this) => unknown) {
        if (!this.events.has(eventName))
            this.events.set(eventName, [])

        this.events.get(eventName)!.push(callback)
        return () =>  {
            console.warn(this)
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
     */
    emit(eventName: string) {
        console.log('emit',this)
        debugger
        if (this.events.has(eventName)) {
            // const clone = this.clone<this>()
            this.events.get(eventName)!
                .forEach(cb => cb(this))
        }
    }

    // private clone<T>():T {
    //     const descriptors = Object.entries({ ...this }).reduce<PropertyDescriptorMap & ThisType<T>>(
    //         (a, [key, value]) => {
    //             a[key] = { value };
    //             return a;
    //         },
    //         {}
    //     );
    //     const cloneElement = Object.create(Object.getPrototypeOf(this), descriptors);
    //     // cloneElement.emit = debounce(this.emit,100,{trailing:true}).bind(this)
    //     return cloneElement
    // }
}