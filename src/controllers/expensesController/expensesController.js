import ActionController from "../ActionController";
import storeDB from "../../classes/db/storeDB/storeDB";
import options from "./controllerOptions";

const expensesController = new ActionController(storeDB, options)


export default expensesController