import React, {StrictMode} from 'react';
import ReactDOM from 'react-dom/client';
import {BrowserRouter} from "react-router-dom";
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import reportWebVitals from './reportWebVitals';

import App from './App';

import setFixedVH from "./utils/setFixedVH";

import './css/index.css';
import {CACHE_VERSION} from "./static/constants";
import errorReport from "./controllers/ErrorReport";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <StrictMode>
        <BrowserRouter>
            <App/>
        </BrowserRouter>
    </StrictMode>
);


setFixedVH()
window.addEventListener('resize', setFixedVH)

const version = JSON.parse(localStorage.getItem('cache-version'))
localStorage.setItem('cache-version', CACHE_VERSION.toString())

if (version !== CACHE_VERSION) {
    serviceWorkerRegistration.unregister()
    caches.keys().then(cacheNames => {
        Promise.all(
            cacheNames.map(cacheName => caches.delete(cacheName))
        ).then(()=> {
            serviceWorkerRegistration.register()
            window?.location.reload()
        })
    }).catch(err => errorReport.sendError(err))
} else {
    serviceWorkerRegistration.register();
}


if (ServiceWorker in window) {
    navigator.serviceWorker.ready.then(registration => console.log(registration))
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
