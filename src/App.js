import {Routes, Route, Outlet, Link, Navigate} from "react-router-dom";

import ExpensesPlan from "./module/Expenses/Pages/ExpensesPlan/ExpensesPlan";
import ExpensesAdd from "./module/Expenses/Pages/ExpensesAdd/ExpensesAdd";
import Limits from "./module/Expenses/Pages/Limits/Limits";
import LimitsEdit from "./module/Expenses/Pages/LimitsEdit/LimitsEdit";
import ExpensesSectionAdd from "./module/Expenses/Pages/ExpensesSectionAdd/ExpensesSectionAdd";

import Main from "./module/Main";
import ExpensesLayout from "./module/Expenses/layouts/ExpensesLayout";
import ExpensesContextProvider from "./module/Expenses/components/ExpensesContextProvider";


function App() {

    return (
        <Routes>
            <Route path={'/'} element={<Main/>}/>
            <Route path={'/travel/:travelCode/expenses/'} element={<ExpensesContextProvider />}>
                <Route element={<ExpensesLayout  user_id={'12'} />}>
                    <Route path={'plan/'} element={<ExpensesPlan  user_id={'12'} />}/>
                    <Route path={'limits/'} element={<Limits  user_id={'12'} />}/>
                </Route>
                <Route path={'limit/:sectionId/'} element={<LimitsEdit  user_id={'12'} />}/>
                <Route path={'add'} element={<ExpensesAdd user_id={'12'} primaryEntityType={'travel'}/>}/>
                <Route path={'plan/add/'} element={<ExpensesAdd  user_id={'12'} primaryEntityType={'travel'} expensesType={'plan'}/>}/>
                <Route path={'section/add/'} element={<ExpensesSectionAdd user_id={'12'}/>}/>
            </Route>
            <Route path={'*'} element={<Navigate to={'/'} replace={true}/>}/>
        </Routes>
    );
}

export default App;
