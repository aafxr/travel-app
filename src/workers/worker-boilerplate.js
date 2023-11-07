/**
 * @param {MessageEvent<WorkerMessageType>} e
 */
self.onmessage = async (e) => {
    try {





        /**@type{WorkerMessageType}*/
        const message = {type: "done"}
        self.postMessage(message)
    } catch (err) {
        /**@type{WorkerMessageType}*/
        const message = {type: "error", payload: err}
        self.postMessage(message)
    }
}

