import {Routes, Route, Navigate} from "react-router-dom";

import ExpensesPlan from "./modules/Expenses/Pages/ExpensesPlan/ExpensesPlan";
import ExpensesAdd from "./modules/Expenses/Pages/ExpensesAdd/ExpensesAdd";
import Expenses from "./modules/Expenses/Pages/Expenses/Expenses";
import LimitsEdit from "./modules/Expenses/Pages/LimitsEdit/LimitsEdit";

import Main from "./modules/Main/Main";
import TravelAdd from "./modules/Travel/Pages/TravelAdd/TravelAdd";
import TravelWaypoint from "./modules/Travel/Pages/TravelWaypoint";
import ExpensesLayout from "./modules/Expenses/layouts/ExpensesLayout";
import ExpensesContextProvider from "./modules/Expenses/contextProvider/ExpensesContextProvider";
import WorkerContextProvider from "./contexts/WorkerContextProvider";
import ErrorBoundary from "./components/ErrorBoundery/ErrorBoundery";
import Alerts from "./components/Alerts/Alerts";
import React from "react";
import Dev from "./modules/Dev";
import TravelContextProvider from "./modules/Travel/contextProviders/TravelContextProvider";


function App() {

    return (
        <ErrorBoundary>
            <Routes>
                <Route element={<TravelContextProvider user_id={'12'} />}>
                    <Route path={'/'} element={<Main/>}/>
                    <Route path={'/dev/'} element={<Dev />}/>
                    <Route element={<WorkerContextProvider/>}>
                        <Route path={'/travel/add/'} element={<TravelAdd user_id={'12'}/>}/>
                        <Route path={'/travel/:travelCode/add/:pointNumber/'} element={<TravelWaypoint/>}/>
                        <Route  element={<ExpensesContextProvider user_id={'12'}/>}>
                            <Route element={<ExpensesLayout user_id={'12'}/>}>
                                <Route path={'/travel/:travelCode/expenses/'} element={<Expenses user_id={'12'}/>}/>
                                <Route path={'/travel/:travelCode/expenses/plan/'} element={<ExpensesPlan user_id={'12'}/>}/>
                            </Route>
                            <Route path={'/travel/:travelCode/expenses/limit/:sectionId/'} element={<LimitsEdit user_id={'12'} primary_entity_type={'travel'}/>}/>

                            <Route path={'/travel/:travelCode/expenses/add/'} element={<ExpensesAdd user_id={'12'} primary_entity_type={'travel'}/>}/>
                            <Route path={'/travel/:travelCode/expenses/edit/:expenseCode/'} element={<ExpensesAdd user_id={'12'} primary_entity_type={'travel'} expensesType='actual' edit />}/>

                            <Route path={'/travel/:travelCode/expenses/plan/add/'} element={<ExpensesAdd user_id={'12'} primary_entity_type={'travel'} expensesType={'plan'}/>}/>
                            <Route path={'/travel/:travelCode/expenses/plan/edit/:expenseCode/'} element={<ExpensesAdd user_id={'12'} primary_entity_type={'travel'} edit />}/>
                        </Route>
                    </Route>
                </Route>
                <Route path={'*'} element={<Navigate to={'/'} replace/>}/>
            </Routes>
            <Alerts  count={3}/>
        </ErrorBoundary>
    );
}

export default App;
