import './css/reset.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import {BrowserRouter} from "react-router-dom";
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

import constants, {CACHE_VERSION, MS_IN_DAY, THEME} from "./static/constants";
import errorReport from "./controllers/ErrorReport";
import setFixedVH from "./utils/setFixedVH";

import {pushAlertMessage} from "./components/Alerts/Alerts";
import storeDB from "./db/storeDB/storeDB";
import App from './App';
import './css/index.css';
import LinkedList from "./utils/data-structures/LinkedList";
import {calcArrivingTime} from "./classes/RoadActivity";
import UserContextProvider from "./contexts/UserContextProvider";
import ThemeContextProvider from "./contexts/ThemeContextProvider";
import BaseService from "./classes/BaseService";
import {nanoid} from "nanoid";
import Route from './classes/Route'
import TimeHelper from "./classes/TimeHelper";
import Graph from "./utils/data-structures/Graph";
import GraphEdge from "./utils/data-structures/GraphEdge";
import GraphVertex from "./utils/data-structures/GraphVertex";
import getDistanceFromTwoPoints from "./utils/getDistanceFromTwoPoints";


let theme = localStorage.getItem(THEME)
theme = theme === 'default' ? 'light-theme' : theme
document.body.classList.add(theme)

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <ThemeContextProvider>
        <UserContextProvider>
            <BrowserRouter>
                <App/>
            </BrowserRouter>
        </UserContextProvider>
    </ThemeContextProvider>
);

window.store = storeDB

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

// const graph = new Graph()
// async function fetchData(){
//     const resp = await fetch ('http://localhost:4200/places')
//     /**@type{PlaceType[]}*/
//     const places = await resp.json()
//
//     const start = Date.now()
//     places.forEach(p => {
//         p.time_end = new Date(p.time_end)
//         p.time_start = new Date(p.time_start)
//         p.toString = function(){
//             return this.id
//         }
//     })
//
//     places.forEach(p => graph.addVertex(new GraphVertex(p)))
//
//     graph
//         .getAllVertices()
//         .forEach((v, idx, arr) => {
//             for(let i = 0; i < arr.length; i++ ){
//                 if(arr[i] === v) continue
//                 const edge = new GraphEdge(v, arr[i], getDistanceFromTwoPoints(v.value.location, arr[i].value.location))
//                 v.addEdge(edge)
//                 graph.addEdge(edge)
//             }
//         })
//
//     const route = []
//
//
//
//     const secToString = (seconds) => {
//         let hh = Math.floor(seconds / (60*60))
//         let mm = Math.floor(seconds % 3600 / 60)
//         let ss = Math.floor(seconds % 60)
//         hh = hh < 10 ? '0' + hh : hh
//         mm = mm < 10 ? '0' + mm : mm
//         ss = ss < 10 ? '0' + ss : ss
//         return `${hh}:${mm}:${ss}`
//     }
//
//
//
//     let startVertex = graph.getAllVertices()[0]
//     const map = new Map()
//     route.push(startVertex.value)
//
//     while(startVertex){
//         const edges = startVertex.getEdges().filter(e => !route.includes(e.endVertex.value))
//         const minDist = Math.min(...edges.map(e => e.weight))
//         const closestEdge = edges.find(e => e.weight === minDist)
//         const closestVertex = closestEdge?.endVertex
//
//         if(closestVertex){
//             startVertex = closestVertex
//             route.push(closestVertex.value)
//             const id =  closestVertex.value.id, dist =  closestEdge.weight
//             const seconds = 60 / 30 * dist
//
//             const time = secToString(seconds)
//             map.set(closestVertex.value.id, {id, dist, time, seconds })
//         } else {
//             startVertex = undefined
//         }
//     }
//     const end = Date.now()
//
//     console.log(route)
//     console.log([...map.values()])
//     console.log('total time ', secToString(Array.from(map.values()).reduce((acc, el) => acc + el.seconds, 0)))
//     console.log(end - start)
//
// }

// fetchData().catch(console.error)
