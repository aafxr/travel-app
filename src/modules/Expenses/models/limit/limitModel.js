import Model from "../../../../models/Model";
import constants from "../../../../static/constants";
import limitValidationObj from "./validation";
import expensesDB from "../../../../db/expensesDB/expensesDB";

const limitModel = new Model(expensesDB, constants.store.LIMIT, limitValidationObj)

export default limitModel