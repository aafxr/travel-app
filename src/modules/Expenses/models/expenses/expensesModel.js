import Model from "../../../../models/Model";
import constants from "../../../../static/constants";
import expensesValidationObj from "./validation";
import expensesDB from "../../db/expensesDB";

export const expensesActualModel = new Model(expensesDB, constants.store.EXPENSES_ACTUAL, expensesValidationObj)
export const expensesPlanModel = new Model(expensesDB, constants.store.EXPENSES_PLAN, expensesValidationObj)