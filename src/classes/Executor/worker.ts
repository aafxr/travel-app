/// <reference lib="webworker" />

import {WorkerMessageType, WorkerResponseType} from "./Executor";

onmessage = function (e: MessageEvent<WorkerMessageType>){
    const {func, params} = e.data

    try{
        const result = new Function('return ' + func + '.apply(null, arguments)')(params)
        if(result instanceof Promise){
            waitAndResponse(result)

        }


    } catch (e){
        const response: WorkerResponseType<undefined> = {
            data: undefined,
            error: e as Error
        }
        postMessage(response)
    }
}

function waitAndResponse(promise: Promise<any>){
    promise.then((data: any) => {
        const response: WorkerResponseType<typeof data> = {
            data
        }
        postMessage(response)
    })
        .catch((e) => {
            const response: WorkerResponseType<undefined> = {
                data: undefined,
                error: e as Error
            }
            postMessage(response)
        })
}