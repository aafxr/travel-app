interface ExecutorOptions<ReturnType> {
    func: Function,
    params?: any,
    done: (err: Error | undefined, data: ReturnType | undefined) => unknown,
}


export type WorkerMessageType = {
    func: Function,
    params: any[],
}

export interface WorkerResponseType<ReturnType>{
    data: ReturnType,
    error?: Error,
}

/**
 * данный класс позволяет выполнять функцию func  в worker
 *
 * __Важно__ func  не должна быть стрелоной функцией
 *
 */
export class Executor<ReturnType = any> {
    func: Function
    params: any  = undefined
    done: (err: Error | undefined, data: ReturnType| undefined) => unknown

    worker: Worker

    constructor(options: ExecutorOptions<ReturnType>) {
        this.func = options.func || (()=>{})
        this.params = options.params
        this.done = options.done || (()=>{})

        this.worker = new Worker(new URL('./worker.ts', import.meta.url))

        this.worker.onmessage = this.onMessage.bind(this)

        this.postMessage(this.params)
    }

    private onMessage(e: MessageEvent<WorkerResponseType<ReturnType>>){
        const {data, error} = e.data
        this.done(error, data)
    }

    terminate(){
        this.worker.terminate()
    }

    postMessage(data: any){
        this.worker.postMessage({
            func: this.func.toString(),
            params: this.params
        })
    }

}