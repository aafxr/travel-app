import React, {Suspense, useEffect} from "react";
import {Routes, Route, Navigate, useNavigate} from "react-router-dom";

// import TravelAddAppointment from "./modules/Travel/Pages/TravelAddAppointment/TravelAddAppointment";
// import TravelAddHotel from "./modules/Travel/Pages/TravelAddHotel/TravelAddHotel";
// import TravelAddLocation from "./modules/Travel/Pages/TravelAddLocation/TravelAddLocation";
// import TravelAddPlane from "./modules/Travel/Pages/TravelAddPlane/TravelAddPlane";
// import TravelOnRoute from "./modules/Travel/Pages/TravelOnRoute/TravelOnRoute";
// import HotelDetails from "./modules/Hotel/Pages/HotelDetails/HotelDetails";
// import ErrorBoundary from "./components/ErrorBoundary/ErrorBoundary";
// import LimitsEdit from "./modules/ExpensesActual/Pages/LimitsEdit/LimitsEdit";
// import WorkerContextProvider from "./contexts/WorkerContextProvider";
// import TravelWaypoint from "./modules/Travel/Pages/TravelWaypoint";
// import PageContainer from "./components/PageContainer/PageContainer";
// import {UserContext} from "./contexts/UserContextProvider";
import Main from "./modules/Main/Pages/Main/Main";
// import ErrorPage from "./modules/OtherPages/ErrorPage";
// import Loader from "./components/Loader/Loader";
import Alerts from "./components/Alerts/Alerts";
// import {USER_AUTH} from "./static/constants";
// import useDBReady from "./hooks/useDBReady";
// import Dev from "./modules/Dev";
// import storeDB from "./db/storeDB/storeDB";
// import TravelPhotoGallery from "./modules/Travel/Pages/TravelPhotoGalery/TravelPhotoGallery";
// import TravelAddPhoto from "./modules/Travel/Pages/TravelAddPhoto/TravelAddPhoto";
// import {Executor} from "./classes/Executor/Executor";
import {Expense, Place, Travel, User} from "./classes/StoreEntities/";
import {DB} from "./classes/db/DB";
import {UserService} from "./classes/services";
import {useAppContext, useUser} from "./contexts/AppContextProvider";
import TravelPermissions from "./modules/Travel/Pages/TravelPermissions/TravelPermissions";
import TravelAddWaypoint from "./modules/Travel/Pages/TravelAddOnMap/TravelAddWaypoint";
import defaultHandleError from "./utils/error-handlers/defaultHandleError";
import ExpensesActual from "./modules/Expenses/Pages/ExpensesActual/ExpensesActual";
import {TelegramAuthPayloadType} from "./types/TelegramAuthPayloadType";
import Loader from "./components/Loader/Loader";



const TravelUserPermissionLazy = React.lazy(() => import("./modules/Travel/Pages/TravelUserPermission/TravelUserPermission"))
const TravelInviteMemberLazy = React.lazy(() => import("./modules/Travel/Pages/TravelInviteMember/TravelInviteMember"))
const ChangeUserPreferencesLazy = React.lazy(() => import("./modules/Main/Pages/Profile/ChangeUserPreferences"))
const TravelAddOnMapLazy = React.lazy(() => import("./modules/Travel/Pages/TravelAddOnMap/TravelAddOnMap"))
const TravelSettingsLazy = React.lazy(() => import("./modules/Travel/Pages/TravelSettings/TravelSettings"))
const TravelAddPlaceLazy = React.lazy(() => import("./modules/Travel/Pages/TravelAddPlace/TravelAddPlace"))
const ExpensesPlanLazy = React.lazy(() => import("./modules/Expenses/Pages/ExpensesPlan/ExpensesPlan"))
const TravelMainLazy = React.lazy(() => import("./modules/Travel/Pages/TravelMain/TravelMain"))
const ExpensesContextProviderLazy = React.lazy(() => import("./contexts/ExpensesContexts/ExpensesContextProvider"))
const TravelDetailsLazy = React.lazy(() => import("./modules/Travel/Pages/TravelParams/TravelDetails"))
const ExpensesAddLazy = React.lazy(() => import("./modules/Expenses/Pages/ExpensesAdd/ExpensesAdd"))
const TravelRoutesLazy = React.lazy(() => import("./modules/Main/Pages/TravelRoutes/TravelRoutes"))
const UserPhotoEditeLazy = React.lazy(() => import("./modules/Main/Pages/Profile/UserPhotoEdite"))
const TravelDescriptionAndDateLazy = React.lazy(() => import("./modules/Travel/Pages/TravelDescriptionAndDate/TravelDescriptionAndDate"))
const UserNameEditeLazy = React.lazy(() => import("./modules/Main/Pages/Profile/UserNameEdite"))
const ActionsListLazy = React.lazy(() => import("./modules/Main/Pages/ActionsList/ActionsList"))
const ExpensesGroupsContextProviderLazy = React.lazy(() => import("./contexts/ExpensesContexts/ExpensesGroupsContextProvider"))
const TravelLayoutLazy = React.lazy(() => import("./layouts/TravelLayout"))
const TravelAddLazy = React.lazy(() => import("./modules/Travel/Pages/TravelAdd/TravelAdd"))
const SessionsLazy = React.lazy(() => import("./modules/Main/Pages/Sessions/Sessions"))
const CheckListLazy = React.lazy(() => import("./components/CheckList/CheckList"))
const TelegramAuthLazy = React.lazy(() => import("./modules/Main/TelegramAuth"))
const LoginLazy = React.lazy(() => import("./modules/Main/Pages/Login/Login"))
const ProfileLazy = React.lazy(() => import("./modules/Main/Pages/Profile/Profile"));
const FavoriteLazy = React.lazy(() => import("./modules/Main/Pages/Favorite/Favorite"));
const EventsLazy = React.lazy(() => import("./modules/Main/Pages/Events/Events"));
const AuthRequiredLazy = React.lazy(() => import("./hoc/AuthRequired"));



function App() {
    const user = useUser()
    const context = useAppContext()
    const navigate = useNavigate()

    useEffect(() => {
        if (!user) {
            UserService.getLoggedInUser()
                .then((user) => {
                    if (user) context.setUser(user)
                })
                .catch(defaultHandleError)
        }
    }, [])

    window.DB = DB
    window.User = User
    window.Expense = Expense
    window.Travel = Travel
    window.Place = Place

    function handleAuth(payload: TelegramAuthPayloadType) {
        UserService.logIn(payload)
            .then(user => {
                if (user) context.setUser(user)
            })
            .then(() => navigate(-1))
            .catch(defaultHandleError)
    }


    return (
        <>
            <Routes>
                {/*<Route element={<WorkerContextProvider/>}>*/}
                <Route path={'/'} element={<Main/>}/>
                <Route path={'/auth/'} element={<Suspense fallback={<Loader/>}><TelegramAuthLazy handleAuth={handleAuth}/></Suspense>}/>
                {/*    <Route path={'/dev/'} element={<Dev/>}/>*/}
                <Route element={<Suspense fallback={<Loader/>}><AuthRequiredLazy/></Suspense>}>
                    <Route path={'/favorite/'} element={<Suspense fallback={<Loader/>}><FavoriteLazy/></Suspense>}/>
                    <Route path={'/travels/:travelsType/'} element={<Suspense fallback={<Loader/>}><TravelRoutesLazy/></Suspense>}/>
                    <Route path={'/events/'} element={<Suspense fallback={<Loader/>}><EventsLazy/></Suspense>}/>
                    <Route path={'/travel/add/'} element={<Suspense fallback={<Loader/>}><TravelAddLazy/></Suspense>}/>
                    <Route element={<Suspense fallback={<Loader/>}><TravelLayoutLazy/></Suspense>}>
                        <Route path={'/travel/:travelCode/map/'} element={<Suspense fallback={<Loader/>}><TravelAddOnMapLazy/></Suspense>}/>
                        <Route path={'/travel/:travelCode/add/waypoint/'} element={<TravelAddWaypoint/>}/>
                        <Route path={'/travel/:travelCode/'} element={<Suspense fallback={<Loader/>}><TravelMainLazy/></Suspense>}/>
                        <Route path={'/travel/:travelCode/:dayNumber/'} element={<Suspense fallback={<Loader/>}><TravelMainLazy/></Suspense>}/>
                        <Route path={'/travel/:travelCode/checklist/'} element={<Suspense fallback={<Loader/>}><CheckListLazy/></Suspense>}/>
                        <Route path={'/travel/:travelCode/settings/'} element={<Suspense fallback={<Loader/>}><TravelSettingsLazy/></Suspense>}/>
                        <Route path={'/travel/:travelCode/settings/:userCode/'} element={<Suspense fallback={<Loader/>}><TravelUserPermissionLazy/></Suspense>}/>
                        <Route path={'/travel/:travelCode/settings/invite/'} element={<Suspense fallback={<Loader/>}><TravelInviteMemberLazy/></Suspense>}/>
                        <Route path={'/travel/:travelCode/description/'} element={<Suspense fallback={<Loader/>}><TravelDescriptionAndDateLazy/></Suspense>}/>
                        <Route path={'/travel/:travelCode/permissions/'} element={<TravelPermissions/>}/>
                        {/*        <Route path={'/travel/:travelCode/add/:pointNumber/'} element={<TravelWaypoint/>}/>*/}
                        <Route path={'/travel/:travelCode/details/'} element={<Suspense fallback={<Loader/>}><TravelDetailsLazy/></Suspense>}/>
                        <Route path={'/travel/:travelCode/add/place/'} element={<Suspense fallback={<Loader/>}><TravelAddPlaceLazy/></Suspense>}/>
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
                        <Route element={<Suspense fallback={<Loader/>}><ExpensesContextProviderLazy/></Suspense>}>
                            <Route element={<Suspense fallback={<Loader/>}><ExpensesGroupsContextProviderLazy/></Suspense>}>
                                <Route path={'/travel/:travelCode/expenses/'} element={<ExpensesActual/>}/>
                                <Route path={'/travel/:travelCode/expenses/plan/'} element={<Suspense fallback={<Loader/>}><ExpensesPlanLazy/></Suspense>}/>
                            </Route>
                        </Route>
                        {/*            <Route path={'/travel/:travelCode/expenses/limit/:sectionId/'} element={<LimitsEdit primary_entity_type={'travel'}/>}/>*/}
                        <Route path={'/travel/:travelCode/expenses/add/'} element={<Suspense fallback={<Loader/>}><ExpensesAddLazy/></Suspense>}/>
                        <Route path={'/travel/:travelCode/expenses/edit/:expenseCode/'} element={<Suspense fallback={<Loader/>}><ExpensesAddLazy/></Suspense>}/>
                        <Route path={'/travel/:travelCode/expenses/plan/add/'} element={<Suspense fallback={<Loader/>}><ExpensesAddLazy/></Suspense>}/>
                        <Route path={'/travel/:travelCode/expenses/plan/edit/:expenseCode/'} element={<Suspense fallback={<Loader/>}><ExpensesAddLazy/></Suspense>}/>
                    </Route>
                    {/*    <Route path={'/hotels/:hotelCode/'} element={<HotelDetails/>}/>*/}
                    <Route path={'/profile/'} element={<Suspense fallback={<Loader/>}><ProfileLazy/></Suspense>}/>
                    <Route path={'/profile/settings/user/'} element={<Suspense fallback={<Loader/>}><ChangeUserPreferencesLazy/></Suspense>}/>
                    <Route path={'/profile/settings/user/name/edite/'} element={<Suspense fallback={<Loader/>}><UserNameEditeLazy/></Suspense>}/>
                    <Route path={'/profile/settings/user/photo/edite/'} element={<Suspense fallback={<Loader/>}><UserPhotoEditeLazy/></Suspense>}/>
                    <Route path={'/profile/actions/'} element={<Suspense fallback={<Loader/>}><ActionsListLazy/></Suspense>}/>
                    <Route path={'/profile/sessions/'} element={<Suspense fallback={<Loader/>}><SessionsLazy/></Suspense>}/>
                </Route>
                <Route path={'/login/'} element={<Suspense fallback={<Loader/>}><LoginLazy/></Suspense>}/>
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
