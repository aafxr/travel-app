import {Provider, useSelector} from 'react-redux'
import React, {useEffect, useState} from "react";
import {Routes, Route, Navigate} from "react-router-dom";

import TravelUserPermission from "./modules/Travel/Pages/TravelUserPermission/TravelUserPermission";
import TravelAddAppointment from "./modules/Travel/Pages/TravelAddAppointment/TravelAddAppointment";
import TravelInviteMember from "./modules/Travel/Pages/TravelInviteMember/TravelInviteMember";
import TravelContextProvider from "./modules/Travel/contextProviders/TravelContextProvider";
import TravelAddLocation from "./modules/Travel/Pages/TravelAddLocation/TravelAddLocation";
import TravelAddWaypoint from "./modules/Travel/Pages/TravelAddWaypoint/TravelAddWaypoint";
import ChangeUserPreferences from "./modules/Main/Pages/Profile/ChangeUserPreferences";
import TravelAddOnMap from "./modules/Travel/Pages/TravelAddOnMap/TravelAddOnMap";
import TravelAddHotel from "./modules/Travel/Pages/TravelAddHotel/TravelAddHotel";
import TravelSettings from "./modules/Travel/Pages/TravelSettings/TravelSettings";
import TravelAddPlane from "./modules/Travel/Pages/TravelAddPlane/TravelAddPlane";
import TravelDetails from "./modules/Travel/Pages/TravelDetails/TravelDetails";
import TravelOnRoute from "./modules/Travel/Pages/TravelOnRoute/TravelOnRoute";
import ExpensesPlan from "./modules/Expenses/Pages/ExpensesPlan/ExpensesPlan";
import ExpensesWrapper from "./modules/Expenses/components/ExpensesWrapper";
import TravelParams from "./modules/Travel/Pages/TravelParams/TravelParams";
import ExpensesAdd from "./modules/Expenses/Pages/ExpensesAdd/ExpensesAdd";
import HotelDetails from "./modules/Hotel/Pages/HotelDetails/HotelDetails";
import TravelRoutes from "./modules/Main/Pages/TravelRoutes/TravelRoutes";
import UserPhotoEdite from "./modules/Main/Pages/Profile/UserPhotoEdite";
import TravelEdite from "./modules/Travel/Pages/TravelEdite/TravelEdite";
// import ErrorBoundary from "./components/ErrorBoundary/ErrorBoundary";
import LimitsEdit from "./modules/Expenses/Pages/LimitsEdit/LimitsEdit";
import UserNameEdite from "./modules/Main/Pages/Profile/UserNameEdite";
import ActionsList from "./modules/Main/Pages/ActionsList/ActionsList";
import ExpensesLayout from "./modules/Expenses/layouts/ExpensesLayout";
import {initTravelsThunk} from "./redux/travelStore/initTravelsThunk";
import WorkerContextProvider from "./contexts/WorkerContextProvider";
import TravelAdd from "./modules/Travel/Pages/TravelAdd/TravelAdd";
import TravelWaypoint from "./modules/Travel/Pages/TravelWaypoint";
import Expenses from "./modules/Expenses/Pages/Expenses/Expenses";
import Favorite from "./modules/Main/Pages/Favorite/Favorite";
import Sessions from "./modules/Main/Pages/Sessions/Sessions";
import Profile from "./modules/Main/Pages/Profile/Profile";
import Events from "./modules/Main/Pages/Events/Events";
import constants, {USER_AUTH} from "./static/constants";
import TelegramAuth from "./modules/Main/TelegramAuth";
import Login from "./modules/Main/Pages/Login/Login";
import {initUser} from "./redux/userStore/initUser";
import Main from "./modules/Main/Pages/Main/Main";
import ErrorPage from "./modules/Error/ErrorPage";
import Loader from "./components/Loader/Loader";
import Alerts from "./components/Alerts/Alerts";
import AuthRequired from "./hoc/AuthRequired";
import useDBReady from "./hooks/useDBReady";
import {store} from './redux/store'
import Dev from "./modules/Dev";


function App() {
    const [state, setState] = useState()
    const ready = useDBReady()

    useEffect(() => {
        store.subscribe(() => setState(store.getState()))
    }, [])

    useEffect(() => {
        if (ready) {
            const user = process.env.NODE_ENV === 'development'
                ? {
                    id: '12',
                    first_name: 'Иван',
                    last_name: 'Алексеев'
                }
                : JSON.parse(localStorage.getItem(USER_AUTH))

            store.dispatch(initUser(user))
            store.dispatch(initTravelsThunk())
        }
    }, [ready])


    if (!ready || state && !state.travel.travelsLoaded) {
        return (
            <div className='wrapper'>
                <div className='content center'>
                    <div className='loader'>
                        <Loader/>
                    </div>
                </div>
            </div>
        )
    }

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
            <>
                <Routes>
                    <Route element={<WorkerContextProvider/>}>
                        <Route element={<TravelContextProvider/>}>
                            <Route path={'/'} element={<Main/>}/>
                            <Route path={'/travels/:travelsType/'} element={<TravelRoutes/>}/>
                            <Route path={'/events/'} element={<Events/>}/>
                            <Route path={'/favorite/'} element={<Favorite/>}/>
                            <Route path={'/auth/'} element={<TelegramAuth/>}/>
                            <Route path={'/dev/'} element={<Dev/>}/>
                            <Route path={'/travel/add/'} element={<AuthRequired><TravelAdd/></AuthRequired>}/>
                            <Route path={'/travel/add/map/'} element={<AuthRequired><TravelAddOnMap/></AuthRequired>}/>
                            <Route path={'/travel/:travelCode/add/map/'} element={<AuthRequired><TravelAddOnMap/></AuthRequired>}/>
                            <Route path={'/travel/:travelCode/add/waypoint/'} element={<AuthRequired><TravelAddWaypoint/></AuthRequired>}/>
                            <Route path={'/travel/:travelCode/'} element={<TravelDetails/>}/>
                            <Route path={'/travel/:travelCode/settings/'} element={<AuthRequired><TravelSettings/></AuthRequired>}/>
                            <Route path={'/travel/:travelCode/settings/:userCode/'} element={<AuthRequired><TravelUserPermission/></AuthRequired>}/>
                            <Route path={'/travel/:travelCode/settings/invite/'} element={<AuthRequired><TravelInviteMember/></AuthRequired>}/>
                            <Route path={'/travel/:travelCode/edite/'} element={<TravelEdite/>}/>
                            <Route path={'/travel/:travelCode/add/:pointNumber/'} element={<TravelWaypoint/>}/>
                            <Route path={'/travel/:travelCode/params/'} element={<TravelParams/>}/>
                            <Route path={'/travel/:travelCode/add/plane/'} element={<TravelAddPlane/>}/>
                            <Route path={'/travel/:travelCode/add/hotel/'} element={<TravelAddHotel/>}/>
                            <Route path={'/travel/:travelCode/add/hotel/:hotelCode/'} element={<TravelAddHotel/>}/>
                            <Route path={'/travel/:travelCode/add/location/'} element={<TravelAddLocation/>}/>
                            <Route path={'/travel/:travelCode/add/appointment/'} element={<TravelAddAppointment/>}/>
                            <Route path={'/travel/:travelCode/add/appointment/:appointmentCode/'} element={<TravelAddAppointment/>}/>
                            <Route path={'/travel/:travelCode/add/recommend/'} element={<TravelOnRoute/>}/>
                            <Route path={'/hotels/:hotelCode/'} element={<HotelDetails/>}/>
                            <Route element={<AuthRequired><ExpensesWrapper/></AuthRequired>}>
                                <Route element={<ExpensesLayout/>}>
                                    <Route path={'/travel/:travelCode/expenses/'} element={<Expenses/>}/>
                                    <Route path={'/travel/:travelCode/expenses/plan/'} element={<ExpensesPlan/>}/>
                                </Route>
                                <Route path={'/travel/:travelCode/expenses/limit/:sectionId/'} element={<LimitsEdit primary_entity_type={'travel'}/>}/>
                                <Route path={'/travel/:travelCode/expenses/add/'} element={<ExpensesAdd primary_entity_type={'travel'} expensesType={'actual'}/>}/>
                                <Route path={'/travel/:travelCode/expenses/edit/:expenseCode/'} element={<ExpensesAdd primary_entity_type={'travel'} expensesType='actual' edit/>}/>
                                <Route path={'/travel/:travelCode/expenses/plan/add/'} element={<ExpensesAdd primary_entity_type={'travel'} expensesType={'plan'}/>}/>
                                <Route path={'/travel/:travelCode/expenses/plan/edit/:expenseCode/'} element={<ExpensesAdd primary_entity_type={'travel'} edit/>}/>
                            </Route>
                            <Route path={'/profile/'} element={<AuthRequired><Profile/></AuthRequired>}/>
                            <Route path={'/profile/settings/user/'} element={<AuthRequired><ChangeUserPreferences/></AuthRequired>}/>
                            <Route path={'/profile/settings/user/name/edite/'} element={<AuthRequired><UserNameEdite/></AuthRequired>}/>
                            <Route path={'/profile/settings/user/photo/edite/'} element={<AuthRequired><UserPhotoEdite/></AuthRequired>}/>
                            <Route path={'/profile/actions/'} element={<AuthRequired><ActionsList/></AuthRequired>}/>
                            <Route path={'/profile/sessions/'} element={<AuthRequired><Sessions/></AuthRequired>}/>
                            <Route path={'/login/'} element={<Login/>}/>
                        </Route>
                    </Route>
                    <Route path={'/error/'} element={<ErrorPage/>}/>
                    <Route path={'*'} element={<Navigate to={'/'} replace/>}/>
                </Routes>
                <Alerts count={2}/>
            </>
        </Provider>
    );
}

export default App;
