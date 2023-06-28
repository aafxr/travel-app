import {Routes, Route, Outlet, Link, Navigate} from "react-router-dom";

import ExpensesPlan from "./module/Expenses/Pages/ExpensesPlan";
import ExpensesActualAdd from "./module/Expenses/Pages/ExpensesActualAdd";
import ExpensesPlanAdd from "./module/Expenses/Pages/ExpensesPlanAdd";
import Main from "./module/Main";
import Limits from "./module/Expenses/Pages/Limits/Limits";
import LimitsEdit from "./module/Expenses/Pages/LimitsEdit";





function App() {

  return (
      <Routes>
          <Route path={'/'} element={<Main />} />
          <Route path={'/travel/:travelCode/expenses/plan/'} element={<ExpensesPlan />} />
          <Route path={'/travel/:travelCode/expenses/limits/'} element={<Limits />} />
          <Route path={'/travel/:travelCode/expenses/limit/:sectionId/'} element={<LimitsEdit />} />
          <Route path={'/travel/:travelCode/expenses/add'} element={<ExpensesActualAdd />} />
          <Route path={'/travel/:travelCode/expenses/plan/add/'} element={<ExpensesPlanAdd />} />
          <Route path={'*'} element={<Navigate to={'/'} replace={true}/>} />
      </Routes>
  );
}

export default App;
