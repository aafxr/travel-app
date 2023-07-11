import {Routes, Route, Navigate} from "react-router-dom";

import ExpensesPlan from "./modules/Expenses/Pages/ExpensesPlan/ExpensesPlan";
import ExpensesAdd from "./modules/Expenses/Pages/ExpensesAdd/ExpensesAdd";
import Expenses from "./modules/Expenses/Pages/Expenses/Expenses";
import LimitsEdit from "./modules/Expenses/Pages/LimitsEdit/LimitsEdit";
import ExpensesSectionAdd from "./modules/Expenses/Pages/ExpensesSectionAdd/ExpensesSectionAdd";

import Main from "./modules/Main";
import TravelAdd from "./modules/Travel/Pages/TravelAdd";
import TravelWaypoint from "./modules/Travel/Pages/TravelWaypoint";
import ExpensesLayout from "./modules/Expenses/layouts/ExpensesLayout";
import ExpensesContextProvider from "./modules/Expenses/contextProvider/ExpensesContextProvider";
import WorkerContextProvider from "./contexts/WorkerContextProvider";
import ErrorBoundary from "./components/ErrorBoundery/ErrorBoundery";


function App() {

    return (
        <ErrorBoundary>
            <Routes>
                <Route element={<WorkerContextProvider/>}>
                    <Route path={'/'} element={<Main/>}/>
                    <Route path={'/travel/:travelCode/add/'} element={<TravelAdd/>}/>
                    <Route path={'/travel/:travelCode/add/:pointNumber'} element={<TravelWaypoint/>}/>
                    <Route path={'/travel/:travelCode/expenses/'} element={<ExpensesContextProvider user_id={'12'}/>}>
                        <Route element={<ExpensesLayout user_id={'12'}/>}>
                            <Route index element={<Expenses user_id={'12'}/>}/>
                            <Route path={'plan/'} element={<ExpensesPlan user_id={'12'}/>}/>
                        </Route>
                        <Route path={'limit/:sectionId/'} element={<LimitsEdit user_id={'12'}/>}/>
                        <Route path={'add'} element={<ExpensesAdd user_id={'12'} primaryEntityType={'travel'}/>}/>
                        <Route path={'plan/add/'}
                               element={<ExpensesAdd user_id={'12'} primaryEntityType={'travel'}
                                                     expensesType={'plan'}/>}/>
                        <Route path={'section/add/'} element={<ExpensesSectionAdd user_id={'12'}/>}/>
                    </Route>
                    <Route path={'*'} element={<Navigate to={'/'} replace={true}/>}/>
                </Route>
            </Routes>
        </ErrorBoundary>
    );
}

export default App;
