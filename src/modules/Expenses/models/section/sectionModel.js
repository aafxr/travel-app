import Model from "../../../../models/Model";
import constants from "../../../../static/constants";
import sectionValidationObj from "./validation";
import storeDB from "../../../../classes/db/storeDB/storeDB";

const sectionModel = new Model(storeDB, constants.store.SECTION, sectionValidationObj)

export default sectionModel