import ActionController from "../ActionController";
import storeDB from "../../db/storeDB/storeDB";
import options from "./controllerOptions";

const expensesController = new ActionController(storeDB, options)


export default expensesController