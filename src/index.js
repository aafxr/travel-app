import './css/reset.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import {BrowserRouter} from "react-router-dom";
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

import constants, {CACHE_VERSION, MS_IN_DAY, THEME} from "./static/constants";
import errorReport from "./controllers/ErrorReport";
import setFixedVH from "./utils/setFixedVH";

import App from './App';
import './css/index.css';
import range from "./utils/range";
import storeDB from "./db/storeDB/storeDB";
import Expense from "./classes/Expense";
import createId from "./utils/createId";
import sleep from "./utils/sleep";
import Travel from "./classes/Travel";
import {pushAlertMessage} from "./components/Alerts/Alerts";
import hamiltonianCycle from "./utils/sort/hamiltonCycle";
import Graph from "./utils/data-structures/Graph";
import GraphEdge from "./utils/data-structures/GraphEdge";
import GraphVertex from "./utils/data-structures/GraphVertex";
import bfTravellingSalesman from "./utils/sort/bfTravellingSalesman";
import PriorityQueue from "./utils/data-structures/PriorityQueue";
import LinkedList from "./utils/data-structures/LinkedList";
import getDistanceFromTwoPoints from "./utils/getDistanceFromTwoPoints";


let theme = localStorage.getItem(THEME)
theme = theme === 'default' ? 'light-theme' : theme
document.body.classList.add(theme)

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <BrowserRouter>
        <App/>
    </BrowserRouter>
);

window.store = storeDB

// const t = Date.now()
// const time = t - t % MS_IN_DAY
// const promises = range(0, 2000)
//     .map(i => {
//
//         const date = new Date(time - MS_IN_DAY * i)
//             .getTime()
//         /**@type{CurrencyType}*/
//         const rub = {char_code:"RUB", name: 'Рубль', value: 1, num_code: 643, symbol: '₽'}
//         /**@type{CurrencyType}*/
//         const usd = {char_code:"USD", name: 'Доллар', value: Math.random() * 100, num_code: 654, symbol: '$'}
//         /**@type{CurrencyType}*/
//         const eur = {char_code:"EUR", name: 'Евро', value: Math.random() * 100, num_code: 593, symbol: '€'}
//         /**@type{CurrencyType}*/
//         const cny = {char_code:"CNY", name: 'Рубль', value: Math.random() * 30, num_code: 683, symbol: 'د.إ'}
//         /**@type{CurrencyType}*/
//         const kzt = {char_code:"KZT", name: 'Рубль', value: Math.random() * 10000, num_code: 603, symbol: '₯'}
//         /** @type{ExchangeType}*/
//         const res= {date, value: [rub, usd, eur, cny, kzt]}
//         return res
//     })
//     .map(ex => storeDB.editElement(constants.store.CURRENCY, ex))
//
// Promise.all(promises)
//     .then(() => console.log('ok'))
//     .then(() => {
//         storeDB.getOne(constants.store.CURRENCY, '12.12.2021').then(console.log)
//     })
//
// sleep(2000)
//     .then(() => {
//         const promises = range(1,100)
//             .map(i => new Expense(null,{
//                 id: '12:'+i,
//                 user_id: '12',
//                 personal: 0,
//                 title: 'test',
//                 primary_entity_id: '12:1698219429629',
//                 created_at: new Date(Date.now() - MS_IN_DAY * i).toISOString(),
//                 datetime: new Date(Date.now() - MS_IN_DAY * i).toISOString(),
//                 value: Math.random() * 1000,
//                 section_id: 'misc',
//                 currency: (i % 2 === 0)
//                     ? '$'
//                     : (i % 3 === 0)
//                         ? '€'
//                         : (i % 5 === 0)
//                             ? '₯'
//                             : 'د.إ',
//             }, '12', 'actual'))
//             .map(item => {
//                 console.log(item)
//                 return storeDB.editElement(constants.store.EXPENSES_ACTUAL, item.object)
//             })
//
//         Promise.all(promises)
//             .then((res) => console.log('ok',res))
//     })

// sleep(2000)
//     .then(() => {
//         const travel =  Travel.newTravel('12')
//         if(travel) {
//             console.log(travel)
//             /**@type{SectionType}*/
//             const section = {
//                 id: '151',
//                 color: '#aaaccf',
//                 title: 'create',
//                 hidden: 0
//
//             }
//             travel.section.update(section,travel.user_id).catch(console.error)
//         }
//     })
//===================== установка фикчированного vh ================================================
setFixedVH()
window.addEventListener('resize', setFixedVH)

//====================== чистка кэш  ===============================================================
const version = JSON.parse(localStorage.getItem('cache-version'))
localStorage.setItem('cache-version', CACHE_VERSION.toString())
if (+version !== CACHE_VERSION) {
    caches.keys().then(cacheNames => {
        return Promise.all(
            cacheNames.map(cacheName => caches.delete(cacheName))
        )
            .then(() => window.location.reload())
    }).catch(err => errorReport.sendError(err))
}

serviceWorkerRegistration.register()


if (ServiceWorker in window) {
    navigator.serviceWorker.ready.then(registration => console.log(registration))
}


document.addEventListener('devicemotion', /** @param {DeviceMotionEvent} e */(e) => {
    const {x, y, z} = e.acceleration
    pushAlertMessage({type: "info", message: `Device move: (${x}, ${y}, ${z})`})
})


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();

