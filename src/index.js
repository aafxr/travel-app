import React, {StrictMode} from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from "react-router-dom";
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import reportWebVitals from './reportWebVitals';

import App from './App';

import setFixedVH from "./utils/setFixedVH";

import './css/index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <StrictMode>
      <BrowserRouter>
          <App />
      </BrowserRouter>
    </StrictMode>
);


setFixedVH()
window.addEventListener('resize', setFixedVH)

serviceWorkerRegistration.register();

if (ServiceWorker in window){
    navigator.serviceWorker.ready.then(registration => console.log(registration))
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
