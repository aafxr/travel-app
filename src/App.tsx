import React, {useEffect} from "react";
import {Routes, Route, Navigate} from "react-router-dom";

import TravelUserPermission from "./modules/Travel/Pages/TravelUserPermission/TravelUserPermission";
// import TravelAddAppointment from "./modules/Travel/Pages/TravelAddAppointment/TravelAddAppointment";
import TravelInviteMember from "./modules/Travel/Pages/TravelInviteMember/TravelInviteMember";
// import TravelAddLocation from "./modules/Travel/Pages/TravelAddLocation/TravelAddLocation";
// import TravelAddWaypoint from "./modules/Travel/Pages/TravelAddWaypoint/TravelAddWaypoint";
import ChangeUserPreferences from "./modules/Main/Pages/Profile/ChangeUserPreferences";
import TravelAddOnMap from "./modules/Travel/Pages/TravelAddOnMap/TravelAddOnMap";
// import TravelAddHotel from "./modules/Travel/Pages/TravelAddHotel/TravelAddHotel";
import TravelSettings from "./modules/Travel/Pages/TravelSettings/TravelSettings";
// import TravelAddPlane from "./modules/Travel/Pages/TravelAddPlane/TravelAddPlane";
import TravelAddPlace from "./modules/Travel/Pages/TravelAddPlace/TravelAddPlace";
import ExpensesPlan from "./modules/Expenses/Pages/ExpensesPlan/ExpensesPlan";
import TravelDetails from "./modules/Travel/Pages/TravelDetails/TravelDetails";
// import TravelOnRoute from "./modules/Travel/Pages/TravelOnRoute/TravelOnRoute";
import ExpensesContextProvider from "./contexts/ExpensesContexts/ExpensesContextProvider";
import TravelParams from "./modules/Travel/Pages/TravelParams/TravelParams";
// import ExpensesAdd from "./modules/ExpensesComponent/Pages/ExpensesAdd/ExpensesAdd";
// import HotelDetails from "./modules/Hotel/Pages/HotelDetails/HotelDetails";
import TravelRoutes from "./modules/Main/Pages/TravelRoutes/TravelRoutes";
import UserPhotoEdite from "./modules/Main/Pages/Profile/UserPhotoEdite";
import TravelDescriptionAndDate from "./modules/Travel/Pages/TravelDescriptionAndDate/TravelDescriptionAndDate";
// import ErrorBoundary from "./components/ErrorBoundary/ErrorBoundary";
// import LimitsEdit from "./modules/ExpensesComponent/Pages/LimitsEdit/LimitsEdit";
import UserNameEdite from "./modules/Main/Pages/Profile/UserNameEdite";
import ActionsList from "./modules/Main/Pages/ActionsList/ActionsList";
import ExpensesGroupsContextProvider from "./contexts/ExpensesContexts/ExpensesGroupsContextProvider";
// import WorkerContextProvider from "./contexts/WorkerContextProvider";
import TravelLayout from "./layouts/TravelLayout";
import TravelAdd from "./modules/Travel/Pages/TravelAdd/TravelAdd";
// import TravelWaypoint from "./modules/Travel/Pages/TravelWaypoint";
import ExpensesComponent from "./modules/Expenses/Pages/ExpensesComponent/ExpensesComponent";
// import PageContainer from "./components/PageContainer/PageContainer";
import Favorite from "./modules/Main/Pages/Favorite/Favorite";
import Sessions from "./modules/Main/Pages/Sessions/Sessions";
// import {UserContext} from "./contexts/UserContextProvider";
import Profile from "./modules/Main/Pages/Profile/Profile";
// import CheckList from "./components/CheckList/CheckList";
import Events from "./modules/Main/Pages/Events/Events";
import TelegramAuth from "./modules/Main/TelegramAuth";
// import Login from "./modules/Main/Pages/Login/Login";
import Main from "./modules/Main/Pages/Main/Main";
// import ErrorPage from "./modules/OtherPages/ErrorPage";
// import Loader from "./components/Loader/Loader";
import Alerts from "./components/Alerts/Alerts";
import AuthRequired from "./hoc/AuthRequired";
// import {USER_AUTH} from "./static/constants";
// import useDBReady from "./hooks/useDBReady";
// import Dev from "./modules/Dev";
// import storeDB from "./db/storeDB/storeDB";
// import TravelPhotoGallery from "./modules/Travel/Pages/TravelPhotoGalery/TravelPhotoGallery";
// import TravelAddPhoto from "./modules/Travel/Pages/TravelAddPhoto/TravelAddPhoto";
// import {Executor} from "./classes/Executor/Executor";
import {Expense, Travel, User} from "./classes/StoreEntities/";
import {DB} from "./classes/db/DB";
import {UserService} from "./classes/services";
import {useAppContext, useUser} from "./contexts/AppContextProvider";
import TravelPermissions from "./modules/Travel/Pages/TravelPermissions/TravelPermissions";


function App() {
    const context = useAppContext()
    const user = useUser()
    // const navigate = useNavigate()
    // const {initUser} = useContext(UserContext)
    // // const [state, setState] = useState()
    // const ready = useDBReady()

    // useEffect(() => {
    //     storeDB.subscribe(() => setState(storeDB.getState()))
    // }, [])

    // useEffect(() => {
    //     if(!'indexedDB' in window)
    //         navigate('/not-supported/')
    // }, [])

    //===========================================================

    useEffect(() => {
        // const user = process.env.NODE_ENV === 'development'
        //     ? {
        //         id: '12',
        //         first_name: 'Иван',
        //         last_name: 'Алексеев'
        //     }
        //     : JSON.parse(localStorage.getItem(USER_AUTH) || '')
        if (!user)
            UserService.getLoggedInUser()
                .then((user) => {
                    if (user) context.setUser(user)
                })
    }, [])


    // if (!ready || userLoading) {
    //     return (
    //         <PageContainer center>
    //             <Loader className='loader'/>
    //         </PageContainer>
    //     )
    // }


    // document.addEventListener('ex')
    //===========================================================


    // useEffect(() => {
    //     const prefetch = [
    //         process.env.REACT_APP_SERVER_URL + '/expenses/getSections/',
    //         process.env.REACT_APP_SERVER_URL + '/main/currency/getList/',
    //     ]
    //
    //     prefetch.forEach(url => aFetch.get(url).catch(console.error))
    // }, [])

    window.DB = DB
    window.User = User
    window.Expense = Expense
    window.Travel = Travel


    return (
        <>
            <Routes>
                {/*<Route element={<WorkerContextProvider/>}>*/}
                <Route path={'/'} element={<Main/>}/>
                {/*<Route path={'/'} element={<AuthRequired><Main/></AuthRequired>}/>*/}
                <Route path={'/travels/:travelsType/'} element={<TravelRoutes/>}/>
                <Route path={'/events/'} element={<Events/>}/>
                <Route path={'/favorite/'} element={<Favorite/>}/>
                <Route path={'/auth/'} element={<TelegramAuth handleAuth={console.log}/>}/>
                {/*    <Route path={'/dev/'} element={<Dev/>}/>*/}
                <Route element={<AuthRequired/>}>
                    <Route path={'/travel/add/'} element={<TravelAdd/>}/>
                    <Route element={<TravelLayout/>}>
                                <Route path={'/travel/:travelCode/map/'} element={<TravelAddOnMap/>}/>
                        {/*        <Route path={'/travel/:travelCode/add/waypoint/:pointCode/'} element={<AuthRequired><TravelAddWaypoint/></AuthRequired>}/>*/}
                        <Route path={'/travel/:travelCode/'} element={<TravelDetails/>}/>
                        <Route path={'/travel/:travelCode/:dayNumber/'} element={<TravelDetails/>}/>
                        {/*<Route path={'/travel/:travelCode/checklist/'} element={<AuthRequired><CheckList/></AuthRequired>}/>*/}
                        <Route path={'/travel/:travelCode/settings/'} element={<TravelSettings/>}/>
                        <Route path={'/travel/:travelCode/settings/:userCode/'} element={<TravelUserPermission/>}/>
                        <Route path={'/travel/:travelCode/settings/invite/'} element={<TravelInviteMember/>}/>
                        <Route path={'/travel/:travelCode/description/'} element={<TravelDescriptionAndDate/>}/>
                        <Route path={'/travel/:travelCode/permissions/'} element={<TravelPermissions/>}/>
                        {/*        <Route path={'/travel/:travelCode/add/:pointNumber/'} element={<TravelWaypoint/>}/>*/}
                        <Route path={'/travel/:travelCode/params/'} element={<TravelParams/>}/>
                        <Route path={'/travel/:travelCode/add/place/'} element={<TravelAddPlace/>}/>
                        {/*<Route path={'/travel/:travelCode/add/place/:timestamp/'} element={<TravelAddPlace/>}/>*/}
                        {/*        <Route path={'/travel/:travelCode/add/plane/'} element={<TravelAddPlane/>}/>*/}
                        {/*        <Route path={'/travel/:travelCode/add/hotel/'} element={<TravelAddHotel/>}/>*/}
                        {/*        <Route path={'/travel/:travelCode/add/hotel/:hotelCode/'} element={<TravelAddHotel/>}/>*/}
                        {/*        <Route path={'/travel/:travelCode/add/location/'} element={<TravelAddLocation/>}/>*/}
                        {/*        <Route path={'/travel/:travelCode/add/appointment/'} element={<TravelAddAppointment/>}/>*/}
                        {/*        <Route path={'/travel/:travelCode/add/appointment/:appointmentCode/'} element={<TravelAddAppointment/>}/>*/}
                        {/*        <Route path={'/travel/:travelCode/add/recommend/'} element={<TravelOnRoute/>}/>*/}
                        {/*        <Route path={'/travel/:travelCode/photoGallery/'} element={<TravelPhotoGallery/>}/>*/}
                        {/*        <Route path={'/travel/:travelCode/photoGallery/add/'} element={<TravelAddPhoto/>}/>*/}
                        <Route element={<ExpensesContextProvider/>}>
                            <Route element={<ExpensesGroupsContextProvider/>}>
                                <Route path={'/travel/:travelCode/expenses/'} element={<ExpensesComponent/>}/>
                                <Route path={'/travel/:travelCode/expenses/plan/'} element={<ExpensesPlan/>}/>
                            </Route>
                            {/*            <Route path={'/travel/:travelCode/expenses/limit/:sectionId/'} element={<LimitsEdit primary_entity_type={'travel'}/>}/>*/}
                            {/*            <Route path={'/travel/:travelCode/expenses/add/'} element={<ExpensesAdd primary_entity_type={'travel'} expensesType={'actual'}/>}/>*/}
                            {/*            <Route path={'/travel/:travelCode/expenses/edit/:expenseCode/'} element={<ExpensesAdd primary_entity_type={'travel'} expensesType='actual' edit/>}/>*/}
                            {/*            <Route path={'/travel/:travelCode/expenses/plan/add/'} element={<ExpensesAdd primary_entity_type={'travel'} expensesType={'planned'}/>}/>*/}
                            {/*            <Route path={'/travel/:travelCode/expenses/plan/edit/:expenseCode/'} element={<ExpensesAdd primary_entity_type={'travel'} edit/>}/>*/}
                        </Route>
                    </Route>
                    {/*    <Route path={'/hotels/:hotelCode/'} element={<HotelDetails/>}/>*/}
                    <Route path={'/profile/'} element={<Profile/>}/>
                    <Route path={'/profile/settings/user/'} element={<ChangeUserPreferences/>}/>
                    <Route path={'/profile/settings/user/name/edite/'} element={<UserNameEdite/>}/>
                    <Route path={'/profile/settings/user/photo/edite/'} element={<UserPhotoEdite/>}/>
                    <Route path={'/profile/actions/'} element={<ActionsList/>}/>
                    <Route path={'/profile/sessions/'} element={<Sessions/>}/>
                </Route>
                {/*    <Route path={'/login/'} element={<Login/>}/>*/}
                {/*</Route>*/}
                {/*<Route path={'/error/'} element={<ErrorPage/>}/>*/}
                {/*<Route path={'/not-supported/'} element={<ErrorPage/>}/>*/}
                <Route path={'*'} element={<Navigate to={'/'} replace/>}/>
            </Routes>
            <Alerts count={2}/>
        </>
    );
}

export default App;
