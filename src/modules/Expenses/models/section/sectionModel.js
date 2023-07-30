import Model from "../../../../models/Model";
import constants from "../../../../static/constants";
import sectionValidationObj from "./validation";
import expensesDB from "../../db/expensesDB";

const sectionModel = new Model(expensesDB, constants.store.SECTION, sectionValidationObj)

export default sectionModel