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
import Alerts, {pushAlertMessage} from "./components/Alerts/Alerts";
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
import defaultHandleError from "./utils/error-handlers/defaultHandleError";
import {useAppContext, useUser} from "./contexts/AppContextProvider";
import {TelegramAuthPayloadType} from "./types/TelegramAuthPayloadType";
import Loader from "./components/Loader/Loader";
import PageContainer from "./components/PageContainer/PageContainer";
import ErrorBoundary from "./components/ErrorBoundary/ErrorBoundary";


const TravelDescriptionAndDateLazy = React.lazy(() => import("./modules/Travel/Pages/TravelDescriptionAndDate/TravelDescriptionAndDate"))
const ExpensesGroupsContextProviderLazy = React.lazy(() => import("./contexts/ExpensesContexts/ExpensesGroupsContextProvider"))
const TravelUserPermissionLazy = React.lazy(() => import("./modules/Travel/Pages/TravelUserPermission/TravelUserPermission"))
const TravelInviteMemberLazy = React.lazy(() => import("./modules/Travel/Pages/TravelInviteMember/TravelInviteMember"))
const TravelPermissionsLazy = React.lazy(() => import("./modules/Travel/Pages/TravelPermissions/TravelPermissions"));
const ExpensesContextProviderLazy = React.lazy(() => import("./contexts/ExpensesContexts/ExpensesContextProvider"))
const TravelAddWaypointLazy = React.lazy(() => import("./modules/Travel/Pages/TravelAddOnMap/TravelAddWaypoint"));
const ChangeUserPreferencesLazy = React.lazy(() => import("./modules/Main/Pages/Profile/ChangeUserPreferences"))
const ExpensesActualLazy = React.lazy(() => import("./modules/Expenses/Pages/ExpensesActual/ExpensesActual"));
const TravelAddOnMapLazy = React.lazy(() => import("./modules/Travel/Pages/TravelAddOnMap/TravelAddOnMap"))
const TravelSettingsLazy = React.lazy(() => import("./modules/Travel/Pages/TravelSettings/TravelSettings"))
const TravelAddPlaceLazy = React.lazy(() => import("./modules/Travel/Pages/TravelAddPlace/TravelAddPlace"))
const ExpensesPlanLazy = React.lazy(() => import("./modules/Expenses/Pages/ExpensesPlan/ExpensesPlan"))
const TravelDetailsLazy = React.lazy(() => import("./modules/Travel/Pages/TravelParams/TravelDetails"))
const ExpensesAddLazy = React.lazy(() => import("./modules/Expenses/Pages/ExpensesAdd/ExpensesAdd"))
const TravelRoutesLazy = React.lazy(() => import("./modules/Main/Pages/TravelRoutes/TravelRoutes"))
const UserPhotoEditeLazy = React.lazy(() => import("./modules/Main/Pages/Profile/UserPhotoEdite"))
const UserNameEditeLazy = React.lazy(() => import("./modules/Main/Pages/Profile/UserNameEdite"))
const ActionsListLazy = React.lazy(() => import("./modules/Main/Pages/ActionsList/ActionsList"))
const TravelMainLazy = React.lazy(() => import("./modules/Travel/Pages/TravelMain/TravelMain"))
const TravelAddLazy = React.lazy(() => import("./modules/Travel/Pages/TravelAdd/TravelAdd"))
const FavoriteLazy = React.lazy(() => import("./modules/Main/Pages/Favorite/Favorite"));
const SessionsLazy = React.lazy(() => import("./modules/Main/Pages/Sessions/Sessions"))
const ProfileLazy = React.lazy(() => import("./modules/Main/Pages/Profile/Profile"));
const CheckListLazy = React.lazy(() => import("./components/CheckList/CheckList"))
const EventsLazy = React.lazy(() => import("./modules/Main/Pages/Events/Events"));
const TelegramAuthLazy = React.lazy(() => import("./modules/Main/TelegramAuth"))
const LoginLazy = React.lazy(() => import("./modules/Main/Pages/Login/Login"))
const TravelLayoutLazy = React.lazy(() => import("./layouts/TravelLayout"))
const AuthRequiredLazy = React.lazy(() => import("./hoc/AuthRequired"));

const PageLoader = (
    <PageContainer>
        <Loader/>
    </PageContainer>
)

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

    useEffect(() => {
        window.ononline = () => {pushAlertMessage({type:"info", message: 'Connection restored'})}
        window.onoffline = () => {pushAlertMessage({type:"info", message: 'Bad connection'})}
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
        <ErrorBoundary>
            <Routes>
                {/*<Route element={<WorkerContextProvider/>}>*/}
                <Route path={'/'} element={<Main/>}/>
                <Route path={'/auth/'}
                       element={<Suspense fallback={PageLoader}><TelegramAuthLazy handleAuth={handleAuth}/></Suspense>}/>
                {/*    <Route path={'/dev/'} element={<Dev/>}/>*/}
                <Route element={<Suspense fallback={PageLoader}><AuthRequiredLazy/></Suspense>}>
                    <Route path={'/favorite/'} element={<Suspense fallback={PageLoader}><FavoriteLazy/></Suspense>}/>
                    <Route path={'/travels/:travelsType/'}
                           element={<Suspense fallback={PageLoader}><TravelRoutesLazy/></Suspense>}/>
                    <Route path={'/events/'} element={<Suspense fallback={PageLoader}><EventsLazy/></Suspense>}/>
                    <Route path={'/travel/add/'} element={<Suspense fallback={PageLoader}><TravelAddLazy/></Suspense>}/>
                    <Route element={<Suspense fallback={PageLoader}><TravelLayoutLazy/></Suspense>}>
                        <Route path={'/travel/:travelCode/map/'}
                               element={<Suspense fallback={PageLoader}><TravelAddOnMapLazy/></Suspense>}/>
                        <Route path={'/travel/:travelCode/add/waypoint/'}
                               element={<Suspense fallback={PageLoader}><TravelAddWaypointLazy/></Suspense>}/>
                        <Route path={'/travel/:travelCode/'}
                               element={<Suspense fallback={PageLoader}><TravelMainLazy/></Suspense>}/>
                        <Route path={'/travel/:travelCode/:dayNumber/'}
                               element={<Suspense fallback={PageLoader}><TravelMainLazy/></Suspense>}/>
                        <Route path={'/travel/:travelCode/checklist/'}
                               element={<Suspense fallback={PageLoader}><CheckListLazy/></Suspense>}/>
                        <Route path={'/travel/:travelCode/settings/'}
                               element={<Suspense fallback={PageLoader}><TravelSettingsLazy/></Suspense>}/>
                        <Route path={'/travel/:travelCode/settings/:userCode/'}
                               element={<Suspense fallback={PageLoader}><TravelUserPermissionLazy/></Suspense>}/>
                        <Route path={'/travel/:travelCode/settings/invite/'}
                               element={<Suspense fallback={PageLoader}><TravelInviteMemberLazy/></Suspense>}/>
                        <Route path={'/travel/:travelCode/description/'}
                               element={<Suspense fallback={PageLoader}><TravelDescriptionAndDateLazy/></Suspense>}/>
                        <Route path={'/travel/:travelCode/permissions/'}
                               element={<Suspense fallback={PageLoader}><TravelPermissionsLazy/></Suspense>}/>
                        {/*        <Route path={'/travel/:travelCode/add/:pointNumber/'} element={<TravelWaypoint/>}/>*/}
                        <Route path={'/travel/:travelCode/details/'}
                               element={<Suspense fallback={PageLoader}><TravelDetailsLazy/></Suspense>}/>
                        <Route path={'/travel/:travelCode/add/place/'}
                               element={<Suspense fallback={PageLoader}><TravelAddPlaceLazy/></Suspense>}/>
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
                        <Route element={<Suspense fallback={PageLoader}><ExpensesContextProviderLazy/></Suspense>}>
                            <Route element={<Suspense
                                fallback={PageLoader}><ExpensesGroupsContextProviderLazy/></Suspense>}>
                                <Route path={'/travel/:travelCode/expenses/'}
                                       element={<Suspense fallback={PageLoader}><ExpensesActualLazy/></Suspense>}/>
                                <Route path={'/travel/:travelCode/expenses/plan/'}
                                       element={<Suspense fallback={PageLoader}><ExpensesPlanLazy/></Suspense>}/>
                            </Route>
                        </Route>
                        {/*            <Route path={'/travel/:travelCode/expenses/limit/:sectionId/'} element={<LimitsEdit primary_entity_type={'travel'}/>}/>*/}
                        <Route path={'/travel/:travelCode/expenses/add/'}
                               element={<Suspense fallback={PageLoader}><ExpensesAddLazy/></Suspense>}/>
                        <Route path={'/travel/:travelCode/expenses/edit/:expenseCode/'}
                               element={<Suspense fallback={PageLoader}><ExpensesAddLazy/></Suspense>}/>
                        <Route path={'/travel/:travelCode/expenses/plan/add/'}
                               element={<Suspense fallback={PageLoader}><ExpensesAddLazy/></Suspense>}/>
                        <Route path={'/travel/:travelCode/expenses/plan/edit/:expenseCode/'}
                               element={<Suspense fallback={PageLoader}><ExpensesAddLazy/></Suspense>}/>
                    </Route>
                    {/*    <Route path={'/hotels/:hotelCode/'} element={<HotelDetails/>}/>*/}
                    <Route path={'/profile/'} element={<Suspense fallback={PageLoader}><ProfileLazy/></Suspense>}/>
                    <Route path={'/profile/settings/user/'}
                           element={<Suspense fallback={PageLoader}><ChangeUserPreferencesLazy/></Suspense>}/>
                    <Route path={'/profile/settings/user/name/edite/'}
                           element={<Suspense fallback={PageLoader}><UserNameEditeLazy/></Suspense>}/>
                    <Route path={'/profile/settings/user/photo/edite/'}
                           element={<Suspense fallback={PageLoader}><UserPhotoEditeLazy/></Suspense>}/>
                    <Route path={'/profile/actions/'}
                           element={<Suspense fallback={PageLoader}><ActionsListLazy/></Suspense>}/>
                    <Route path={'/profile/sessions/'}
                           element={<Suspense fallback={PageLoader}><SessionsLazy/></Suspense>}/>
                </Route>
                <Route path={'/login/'} element={<Suspense fallback={PageLoader}><LoginLazy/></Suspense>}/>
                {/*</Route>*/}
                {/*<Route path={'/error/'} element={<ErrorPage/>}/>*/}
                {/*<Route path={'/not-supported/'} element={<ErrorPage/>}/>*/}
                <Route path={'*'} element={<Navigate to={'/'} replace/>}/>
            </Routes>
            <Alerts count={2}/>
        </ErrorBoundary>
    );
}

export default App;
