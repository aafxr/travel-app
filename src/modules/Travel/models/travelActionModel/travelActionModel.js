import Model from "../../../../models/Model";
import constants from "../../../../static/constants";
import validationObj from "../../../../models/action/validation";
import expensesDB from "../../db/travelDB";

const travelActionModel = new Model(expensesDB, constants.store.EXPENSES_ACTIONS, validationObj)

export default travelActionModel