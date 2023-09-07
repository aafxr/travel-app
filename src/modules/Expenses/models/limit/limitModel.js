import Model from "../../../../models/Model";
import constants from "../../../../static/constants";
import limitValidationObj from "./validation";
import storeDB from "../../../../db/storeDB/storeDB";

const limitModel = new Model(storeDB, constants.store.LIMIT, limitValidationObj)

export default limitModel