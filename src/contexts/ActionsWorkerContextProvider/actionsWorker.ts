/// <reference lib="webworker" />

import {ActionWorkerMessage, ActionWorkerMessageType} from "./ActionWorkerMessage";
import {Action, User} from "../../classes/StoreEntities";
import {StoreName} from "../../types/StoreName";
import {IndexName} from "../../types/IndexName";
import {DB} from "../../classes/db/DB";
import sleep from "../../utils/sleep";
import aFetch from "../../axios";

const SLEEP = 3000

let user: User | undefined
let init = false


self.onmessage = (e: MessageEvent<ActionWorkerMessageType>) => {
    const msg = e.data
    if (msg.type === 'user') {
        console.log(msg)
        user = msg.payload
    } else if (msg.type === 'init') {
        user = msg.payload.user
        init = true
    }
}


if (location.hostname !== 'localhost') {
    (async () => {
        while (true) {
            if (!init) {
                console.log('wait for init')
                await sleep(SLEEP)
                continue
            }

            if (!user) {
                console.log('worker unauthorized')
                self.postMessage(ActionWorkerMessage.unauthorized())
                await sleep(SLEEP)
                continue
            }

            const actions = await DB.getManyFromIndex<Action<any>>(StoreName.ACTION, IndexName.SYNCED, 0, 50)
            const travelActions = actions.filter(a => a.entity === StoreName.TRAVEL)

            if (!actions.length) {
                await sleep(SLEEP)
                continue
            }

            try {
                const {data: response, status} = await aFetch.post<
                    { ok: boolean, result: { [id: string]: { id: string, ok: boolean } } }
                >('/actions/add/', actions)

                await aFetch.post('/mqp/put/travel/', travelActions)

                if (status === 401) {
                    user = undefined
                    self.postMessage(ActionWorkerMessage.unauthorized())
                }

                if (response.ok) {
                    const result = response.result
                    let sync = false
                    actions.forEach(a => {
                        if (result[a.id] && result[a.id].ok) {
                            a.synced = 1
                            sync = true
                        }
                    })

                    if (sync) {
                        await DB.writeAllToStore(StoreName.ACTION, actions)
                        postMessage(ActionWorkerMessage.synced())
                    }
                }

            } catch (e) {
                console.error(e)
                await sleep(SLEEP)
            }

        }
    })()
}