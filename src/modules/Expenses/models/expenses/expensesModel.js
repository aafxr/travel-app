import Model from "../../../../models/Model";
import constants from "../../../../static/constants";
import expensesValidationObj from "./validation";
import storeDB from "../../../../db/storeDB/storeDB";

export const expensesActualModel = new Model(storeDB, constants.store.EXPENSES_ACTUAL, expensesValidationObj)
export const expensesPlanModel = new Model(storeDB, constants.store.EXPENSES_PLAN, expensesValidationObj)