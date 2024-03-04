import React, {useEffect} from "react";
import {Routes, Route, Navigate, useNavigate} from "react-router-dom";

import Main from "./modules/Main/Pages/Main/Main";
import Alerts, {pushAlertMessage} from "./components/Alerts/Alerts";
import {Expense, Place, Travel, User} from "./classes/StoreEntities/";
import {DB} from "./classes/db/DB";
import {UserService} from "./classes/services";
import defaultHandleError from "./utils/error-handlers/defaultHandleError";
import {useAppContext, useUser} from "./contexts/AppContextProvider";
import {TelegramAuthPayloadType} from "./types/TelegramAuthPayloadType";
import ErrorBoundary from "./components/ErrorBoundary/ErrorBoundary";
import TelegramAuth from "./modules/Main/TelegramAuth";
import AuthRequired from "./hoc/AuthRequired";
import Favorite from "./modules/Main/Pages/Favorite/Favorite";
import TravelRoutes from "./modules/Main/Pages/TravelRoutes/TravelRoutes";
import Events from "./modules/Main/Pages/Events/Events";
import TravelAdd from "./modules/Travel/Pages/TravelAdd/TravelAdd";
import TravelLayout from "./layouts/TravelLayout";
import TravelAddOnMap from "./modules/Travel/Pages/TravelAddOnMap/TravelAddOnMap";
import TravelAddWaypoint from "./modules/Travel/Pages/TravelAddOnMap/TravelAddWaypoint";
import TravelMain from "./modules/Travel/Pages/TravelMain/TravelMain";
import CheckListComponent from "./components/CheckList/CheckList";
import TravelSettings from "./modules/Travel/Pages/TravelSettings/TravelSettings";
import TravelUserPermission from "./modules/Travel/Pages/TravelUserPermission/TravelUserPermission";
import TravelInviteMember from "./modules/Travel/Pages/TravelInviteMember/TravelInviteMember";
import TravelDescriptionAndDate from "./modules/Travel/Pages/TravelDescriptionAndDate/TravelDescriptionAndDate";
import TravelPermissions from "./modules/Travel/Pages/TravelPermissions/TravelPermissions";
import TravelDetails from "./modules/Travel/Pages/TravelParams/TravelDetails";
import TravelAddPlace from "./modules/Travel/Pages/TravelAddPlace/TravelAddPlace";
import ExpensesContextProvider from "./contexts/ExpensesContexts/ExpensesContextProvider";
import ExpensesGroupsContextProvider from "./contexts/ExpensesContexts/ExpensesGroupsContextProvider";
import ExpensesActual from "./modules/Expenses/Pages/ExpensesActual/ExpensesActual";
import ExpensesPlan from "./modules/Expenses/Pages/ExpensesPlan/ExpensesPlan";
import ExpensesAdd from "./modules/Expenses/Pages/ExpensesAdd/ExpensesAdd";
import Profile from "./modules/Main/Pages/Profile/Profile";
import ChangeUserPreferences from "./modules/Main/Pages/Profile/ChangeUserPreferences";
import UserNameEdite from "./modules/Main/Pages/Profile/UserNameEdite";
import UserPhotoEdite from "./modules/Main/Pages/Profile/UserPhotoEdite";
import ActionsList from "./modules/Main/Pages/ActionsList/ActionsList";
import Sessions from "./modules/Main/Pages/Sessions/Sessions";
import Login from "./modules/Main/Pages/Login/Login";
import TravelAdviceRoute from "./modules/Travel/Pages/TravelAdviceRoute/TravelAdviceRoute";
import {ExchangeContextProvider} from "./contexts/ExchangeContext";
import LimitsEdit from "./modules/Expenses/Pages/LimitsEdit/LimitsEdit";
import ActionsWorkerContextProvider from "./contexts/ActionsWorkerContextProvider/ActionsWorkerContextProvider";
import {SocketContextProvider} from "./contexts/SocketContextProvider";
import {Dev} from "./modules/Dev";


// const TravelDescriptionAndDateLazy = React.lazy(() => import("./modules/Travel/Pages/TravelDescriptionAndDate/TravelDescriptionAndDate"))
// const ExpensesGroupsContextProviderLazy = React.lazy(() => import("./contexts/ExpensesContexts/ExpensesGroupsContextProvider"))
// const TravelUserPermissionLazy = React.lazy(() => import("./modules/Travel/Pages/TravelUserPermission/TravelUserPermission"))
// const TravelInviteMemberLazy = React.lazy(() => import("./modules/Travel/Pages/TravelInviteMember/TravelInviteMember"))
// const TravelPermissionsLazy = React.lazy(() => import("./modules/Travel/Pages/TravelPermissions/TravelPermissions"));
// const ExpensesContextProviderLazy = React.lazy(() => import("./contexts/ExpensesContexts/ExpensesContextProvider"))
// const TravelAddWaypointLazy = React.lazy(() => import("./modules/Travel/Pages/TravelAddOnMap/TravelAddWaypoint"));
// const ChangeUserPreferencesLazy = React.lazy(() => import("./modules/Main/Pages/Profile/ChangeUserPreferences"))
// const ExpensesActualLazy = React.lazy(() => import("./modules/Expenses/Pages/ExpensesActual/ExpensesActual"));
// const TravelAddOnMapLazy = React.lazy(() => import("./modules/Travel/Pages/TravelAddOnMap/TravelAddOnMap"))
// const TravelSettingsLazy = React.lazy(() => import("./modules/Travel/Pages/TravelSettings/TravelSettings"))
// const TravelAddPlaceLazy = React.lazy(() => import("./modules/Travel/Pages/TravelAddPlace/TravelAddPlace"))
// const ExpensesPlanLazy = React.lazy(() => import("./modules/Expenses/Pages/ExpensesPlan/ExpensesPlan"))
// const TravelDetailsLazy = React.lazy(() => import("./modules/Travel/Pages/TravelParams/TravelDetails"))
// const ExpensesAddLazy = React.lazy(() => import("./modules/Expenses/Pages/ExpensesAdd/ExpensesAdd"))
// const TravelRoutesLazy = React.lazy(() => import("./modules/Main/Pages/TravelRoutes/TravelRoutes"))
// const UserPhotoEditeLazy = React.lazy(() => import("./modules/Main/Pages/Profile/UserPhotoEdite"))
// const UserNameEditeLazy = React.lazy(() => import("./modules/Main/Pages/Profile/UserNameEdite"))
// const ActionsListLazy = React.lazy(() => import("./modules/Main/Pages/ActionsList/ActionsList"))
// const TravelMainLazy = React.lazy(() => import("./modules/Travel/Pages/TravelMain/TravelMain"))
// const TravelAddLazy = React.lazy(() => import("./modules/Travel/Pages/TravelAdd/TravelAdd"))
// const FavoriteLazy = React.lazy(() => import("./modules/Main/Pages/Favorite/Favorite"));
// const SessionsLazy = React.lazy(() => import("./modules/Main/Pages/Sessions/Sessions"))
// const ProfileLazy = React.lazy(() => import("./modules/Main/Pages/Profile/Profile"));
// const CheckListLazy = React.lazy(() => import("./components/CheckList/CheckList"))
// const EventsLazy = React.lazy(() => import("./modules/Main/Pages/Events/Events"));
// const TelegramAuthLazy = React.lazy(() => import("./modules/Main/TelegramAuth"))
// const LoginLazy = React.lazy(() => import("./modules/Main/Pages/Login/Login"))
// const TravelLayoutLazy = React.lazy(() => import("./layouts/TravelLayout"))
// const AuthRequiredLazy = React.lazy(() => import("./hoc/AuthRequired"));
//
// const PageLoader = (
//     <PageContainer>
//         <Loader/>
//     </PageContainer>
// )

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
        window.ononline = () => {
            pushAlertMessage({type: "info", message: 'Connection restored'})
        }
        window.onoffline = () => {
            pushAlertMessage({type: "info", message: 'Bad connection'})
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
        <ErrorBoundary>
            <Routes>
                <Route path={'/'} element={<Main/>}/>
                <Route path={'/auth/'} element={<TelegramAuth handleAuth={handleAuth}/>}/>
                <Route path={'/dev/'} element={<Dev/>}/>
                <Route element={<AuthRequired/>}>
                    <Route element={<ActionsWorkerContextProvider/>}>
                        <Route path={'/favorite/'} element={<Favorite/>}/>
                        <Route path={'/travels/:travelsType/'} element={<TravelRoutes/>}/>
                        <Route path={'/events/'} element={<Events/>}/>
                        <Route path={'/travel/add/'} element={<TravelAdd/>}/>
                        <Route path={'/travel/:travelCode/settings/'} element={<TravelSettings/>}/>
                        <Route element={<TravelLayout/>}>
                            <Route element={<SocketContextProvider />} >
                                <Route path={'/travel/:travelCode/advice-route/'} element={<TravelAdviceRoute/>}/>
                                <Route path={'/travel/:travelCode/map/'} element={<TravelAddOnMap/>}/>
                                <Route path={'/travel/:travelCode/add/waypoint/'} element={<TravelAddWaypoint/>}/>
                                <Route path={'/travel/:travelCode/'} element={<TravelMain/>}/>
                                <Route path={'/travel/:travelCode/:dayNumber/'} element={<TravelMain/>}/>
                                <Route path={'/travel/:travelCode/checklist/'} element={<CheckListComponent/>}/>
                                <Route path={'/travel/:travelCode/settings/:userCode/'} element={<TravelUserPermission/>}/>
                                <Route path={'/travel/:travelCode/settings/invite/'} element={<TravelInviteMember/>}/>
                                <Route path={'/travel/:travelCode/description/'} element={<TravelDescriptionAndDate/>}/>
                                <Route path={'/travel/:travelCode/permissions/'} element={<TravelPermissions/>}/>
                                {/*        <Route path={'/travel/:travelCode/add/:pointNumber/'} element={<TravelWaypoint/>}/>*/}
                                <Route path={'/travel/:travelCode/details/'} element={<TravelDetails/>}/>
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
                                <Route element={<ExchangeContextProvider/>}>
                                    <Route element={<ExpensesContextProvider/>}>
                                        <Route element={<ExpensesGroupsContextProvider/>}>
                                            <Route path={'/travel/:travelCode/expenses/'} element={<ExpensesActual/>}/>
                                            <Route path={'/travel/:travelCode/expenses/plan/'} element={<ExpensesPlan/>}/>
                                        </Route>
                                    </Route>
                                    <Route path={'/travel/:travelCode/expenses/limit/:sectionId/'} element={<LimitsEdit />}/>
                                    <Route path={'/travel/:travelCode/expenses/add/'} element={<ExpensesAdd/>}/>
                                    <Route path={'/travel/:travelCode/expenses/edit/:expenseCode/'} element={<ExpensesAdd/>}/>
                                    <Route path={'/travel/:travelCode/expenses/plan/add/'} element={<ExpensesAdd/>}/>
                                    <Route path={'/travel/:travelCode/expenses/plan/edit/:expenseCode/'} element={<ExpensesAdd/>}/>
                                </Route>
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
                </Route>
                <Route path={'/login/'} element={<Login/>}/>
                {/*<Route path={'/error/'} element={<ErrorPage/>}/>*/}
                {/*<Route path={'/not-supported/'} element={<ErrorPage/>}/>*/}
                <Route path={'*'} element={<Navigate to={'/'} replace/>}/>
            </Routes>
            <Alerts count={2}/>
        </ErrorBoundary>
    );
}

export default App;
