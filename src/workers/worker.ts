// import functionDurationTest from "../utils/functionDurationTest";
// import distinctValues from "../utils/distinctValues";
// import getActionsList from "./getActionsList";
// import constants from "../static/constants";
// import aFetch from "../axios";
// import {Action} from "../classes/StoreEntities";
// import {ActionType} from "../types/ActionsType";
// import {StoreName} from "../types/StoreName";
// import {IndexName} from "../types/IndexName";
// import {DB} from "../db/DB";
//
// console.log('====worker=====')
//
//
// function fetchActions(message) {
//     functionDurationTest(getActionsList.bind(null, message), '[Worker] Время обработки actions: ')
// }
//
// onmessage = messageHandler
//
// /**
//  * @param {MessageEvent<WorkerMessageType>} e
//  */
// function messageHandler(e) {
//     const message = e.data
//     const {type} = message
//
//     console.log(message)
//
//     // if (Array.isArray(data)) {
//     //     type === 'action' && actionsProcess(message)
//     // }
//     type === 'fetch' && fetchActions(message)
//     type === 'init' && init()
//     if(type === "update-expenses-actual"){
//         const aWorker = new Worker(new URL('./worker-expenses-total-update.js', import.meta.url))
//         aWorker.onerror = () => (err) => {
//             console.error(err)
//             //... other error handlers
//         }
//     }
// }
//
// function init(){
//     sendActions()
// }
//
// function sendActions(){
//     //=================================== проверка и попытка отправить ExpensesActual Actions ====================================
//     setInterval(async () => {
//         try {
//             DB.getManyFromIndex<ActionType>(StoreName.ACTION, IndexName.SYNCED, 0, (actions) => {
//                 if (actions.length) {
//                     const response = await aFetch.post('/actions/add/', actions)
//                     console.log(response.data)
//                     const {ok, result} = response.data
//
//                     if (ok) {
//                         const sendedActions = actions.filter(a => result[a.id] && result[a.id].ok)
//                             .map(a => {
//                                 a.synced = 1
//                                 return a
//                             })
//                         await Promise.all(sendedActions.map(a => DB.update(a, new User({id: a.id}))))
//                             .then(() => actionsUpdatedNotification(sendedActions))
//                     }
//                 }
//             })
//     }, 4000)
//
//
// //=================================== проверка и попытка отправить Travels Actions =====================================
//     setInterval(async () => {
//         try {
//             const actions = await storeDB.getManyFromIndex(constants.store.TRAVEL_ACTIONS, constants.indexes.SYNCED, 0)
//             if (actions && actions.length) {
//                 const response = await aFetch.post('/actions/add/', actions)
//                 console.log(response.data)
//                 const {ok, result} = response.data
//
//                 if (ok) {
//                     const sendedActions = actions.filter(a => result[a.id] && result[a.id].ok)
//                         .map(a => {
//                             a.synced = 1
//                             return a
//                         })
//                     await Promise.all(sendedActions.map(a => storeDB.editElement(constants.store.TRAVEL_ACTIONS, a)))
//                         .then(() => actionsUpdatedNotification(sendedActions))
//                 }
//             }
//         } catch (err) {
//             console.error(err)
//         }
//
//     }, 10000)
//
// //=================================== проверка и попытка отправить Travels Actions =====================================
//     setInterval(async () => {
//         try {
//             const actions = await storeDB.getManyFromIndex(constants.store.STORE_ACTIONS, constants.indexes.SYNCED, 0)
//             if (actions && actions.length) {
//                 const response = await aFetch.post('/actions/add/', actions)
//                 console.log(response.data)
//                 const {ok, result} = response.data
//
//                 if (ok) {
//                     const sendedActions = actions.filter(a => result[a.id] && result[a.id].ok)
//                         .map(a => {
//                             a.synced = 1
//                             return a
//                         })
//                     await Promise.all(sendedActions.map(a => storeDB.editElement(constants.store.STORE_ACTIONS, a)))
//                         .then(() => actionsUpdatedNotification(sendedActions))
//                 }
//             }
//         } catch (err) {
//             console.error(err)
//         }
//
//     }, 8000)
// }
//
//
// //================================== Отправка уведомления об обновлении actions ========================================
// function actionsUpdatedNotification(actions) {
//     const entity = distinctValues(actions, a => a.entity)
//     entity.forEach(e =>
//         postMessage({type: e})
//     )
// }
export const a = {
    a() {
        console.log('worker')
    }
}
