import Model from "../../../../models/Model";
import constants from "../../../../static/constants";
import validationObj from "../../../../models/action/validation";
import storeDB from "../../../../classes/db/storeDB/storeDB";

const travelActionModel = new Model(storeDB, constants.store.TRAVEL_ACTIONS, validationObj)

export default travelActionModel