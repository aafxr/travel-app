import {Routes, Route, Outlet, Link, Navigate} from "react-router-dom";
import ExpensesPlan from "./module/Expenses/Plan";
import ExpensesAdd from "./module/Expenses/ExpensesAdd";
import Main from "./module/Main";
function App() {

  return (
      <Routes>
          <Route path={'/'} element={<Main />} />
          <Route path={'/travel/:travelCode/expenses/add'} element={<ExpensesAdd />} />
          <Route path={'/travel/:travelCode/expenses/plan/'} element={<ExpensesPlan />} />
          <Route path={'*'} element={<Navigate to={'/'} replace={true}/>} />
      </Routes>
  );
}

export default App;
