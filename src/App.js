import {Provider} from 'react-redux'
import React, {useEffect} from "react";
import {Routes, Route, Navigate} from "react-router-dom";
import aFetch from "./axios";

import ExpensesPlan from "./modules/Expenses/Pages/ExpensesPlan/ExpensesPlan";
import ExpensesAdd from "./modules/Expenses/Pages/ExpensesAdd/ExpensesAdd";
import Expenses from "./modules/Expenses/Pages/Expenses/Expenses";

import Main from "./modules/Main/Pages/Main/Main";
import TravelAdd from "./modules/Travel/Pages/TravelAdd/TravelAdd";
import TravelWaypoint from "./modules/Travel/Pages/TravelWaypoint";
import ExpensesLayout from "./modules/Expenses/layouts/ExpensesLayout";
import ExpensesWrapper from "./modules/Expenses/components/ExpensesWrapper";
import WorkerContextProvider from "./contexts/WorkerContextProvider";
import ErrorBoundary from "./components/ErrorBoundery/ErrorBoundery";
import Alerts from "./components/Alerts/Alerts";
import Dev from "./modules/Dev";
import TravelContextProvider from "./modules/Travel/contextProviders/TravelContextProvider";
import ErrorPage from "./modules/Error/ErrorPage";
import TravelDetails from "./modules/Travel/Pages/TravelDetails/TravelDetails";
import TelegramAuth from "./modules/Main/TelegramAuth";
import UserContextProvider from "./contexts/UserContextProvider.jsx";
import LimitsEdit from "./modules/Expenses/Pages/LimitsEdit/LimitsEdit";
import Profile from "./modules/Main/Pages/Profile/Profile";
import Login from "./modules/Main/Pages/Login/Login";
import AuthRequired from "./hoc/AuthRequired";
import TravelRoutes from "./modules/Main/Pages/Routes/TravelRoutes";
import Events from "./modules/Main/Pages/Events/Events";
import Favorite from "./modules/Main/Pages/Favorite/Favorite";
import {actions, store} from './redux/store'
import {initTravelsThunk} from "./redux/travelStore/initTravelsThunk";


function App() {
    useEffect(() => {
        store.dispatch(actions.userActions.initUser())
        store.dispatch(initTravelsThunk())
    }, [])

    // useEffect(() => {
    //     const prefetch = [
    //         process.env.REACT_APP_SERVER_URL + '/expenses/getSections/',
    //         process.env.REACT_APP_SERVER_URL + '/main/currency/getList/',
    //     ]
    //
    //     prefetch.forEach(url => aFetch.get(url).catch(console.error))
    // }, [])

    return (
        <Provider store={store}>
            <ErrorBoundary>
                <Routes>
                    <Route element={<UserContextProvider/>}>
                        <Route element={<WorkerContextProvider/>}>
                            <Route element={<TravelContextProvider/>}>
                                <Route path={'/'} element={<Main/>}/>
                                <Route path={'/travels/:travelsType/'} element={<TravelRoutes/>}/>
                                <Route path={'/events/'} element={<Events/>}/>
                                <Route path={'/favorite/'} element={<Favorite/>}/>
                                <Route path={'/auth/'} element={<TelegramAuth/>}/>
                                <Route path={'/dev/'} element={<Dev/>}/>
                                <Route path={'/travel/add/'} element={<AuthRequired><TravelAdd/></AuthRequired>}/>
                                <Route path={'/travel/:travelCode/'} element={<TravelDetails/>}/>
                                <Route path={'/travel/:travelCode/add/:pointNumber/'} element={<TravelWaypoint/>}/>
                                <Route element={<AuthRequired><ExpensesWrapper/></AuthRequired>}>
                                    <Route element={<ExpensesLayout/>}>
                                        <Route path={'/travel/:travelCode/expenses/'} element={<Expenses/>}/>
                                        <Route path={'/travel/:travelCode/expenses/plan/'} element={<ExpensesPlan/>}/>
                                    </Route>
                                    <Route path={'/travel/:travelCode/expenses/limit/:sectionId/'}
                                           element={<LimitsEdit primary_entity_type={'travel'}/>}/>
                                    <Route path={'/travel/:travelCode/expenses/add/'}
                                           element={<ExpensesAdd primary_entity_type={'travel'}
                                                                 expensesType={'actual'}/>}/>
                                    <Route path={'/travel/:travelCode/expenses/edit/:expenseCode/'}
                                           element={<ExpensesAdd primary_entity_type={'travel'} expensesType='actual'
                                                                 edit/>}/>
                                    <Route path={'/travel/:travelCode/expenses/plan/add/'}
                                           element={<ExpensesAdd primary_entity_type={'travel'}
                                                                 expensesType={'plan'}/>}/>
                                    <Route path={'/travel/:travelCode/expenses/plan/edit/:expenseCode/'}
                                           element={<ExpensesAdd primary_entity_type={'travel'} edit/>}/>
                                </Route>
                                <Route path={'/profile/'} element={<AuthRequired><Profile/></AuthRequired>}/>
                                <Route path={'/login/'} element={<Login/>}/>
                            </Route>
                        </Route>
                    </Route>
                    <Route path={'/error/'} element={<ErrorPage/>}/>
                    <Route path={'*'} element={<Navigate to={'/'} replace/>}/>
                </Routes>
                <Alerts count={3}/>
            </ErrorBoundary>
        </Provider>
    );
}

export default App;
