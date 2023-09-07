import Model from "../../../../models/Model";
import constants from "../../../../static/constants";
import validationObj from "../../../../models/action/validation";
import storeDB from "../../../../db/storeDB/storeDB";

const expensesActionModel = new Model(storeDB, constants.store.EXPENSES_ACTIONS, validationObj)

export default expensesActionModel