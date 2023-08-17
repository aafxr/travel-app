import ActionController from "../ActionController";
import expensesDB from "../../db/expensesDB/expensesDB";
import options from "./controllerOptions";

const expensesController = new ActionController(expensesDB, options)


export default expensesController