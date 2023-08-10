import ActionController from "../../../controllers/ActionController";
import expensesDB from "../db/expensesDB";
import options from "./controllerOptions";

const expensesController = new ActionController(expensesDB, options)


export default expensesController