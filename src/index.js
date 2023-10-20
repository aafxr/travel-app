import React from 'react';
import ReactDOM from 'react-dom/client';
import {BrowserRouter} from "react-router-dom";
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

import {CACHE_VERSION, THEME} from "./static/constants";
import errorReport from "./controllers/ErrorReport";
import setFixedVH from "./utils/setFixedVH";

import App from './App';

import './css/index.css';
import Travel from "./classes/Travel";

const travel = new Travel()
console.log(''+travel)

let theme = localStorage.getItem(THEME)
theme = theme === 'default' ? 'light-theme' : theme
document.body.classList.add(theme)

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <BrowserRouter>
        <App/>
    </BrowserRouter>
);

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


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
