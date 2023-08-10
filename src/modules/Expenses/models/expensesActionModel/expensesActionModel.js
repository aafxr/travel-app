import Model from "../../../../models/Model";
import constants from "../../../../static/constants";
import validationObj from "../../../../models/action/validation";
import expensesDB from "../../db/expensesDB";

const expensesActionModel = new Model(expensesDB, constants.store.EXPENSES_ACTIONS, validationObj)

export default expensesActionModel