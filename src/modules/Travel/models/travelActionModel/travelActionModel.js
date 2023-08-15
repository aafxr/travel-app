import Model from "../../../../models/Model";
import constants from "../../../../static/constants";
import validationObj from "../../../../models/action/validation";
import travelDB from "../../../../db/travelDB/travelDB";

const travelActionModel = new Model(travelDB, constants.store.TRAVEL_ACTIONS, validationObj)

export default travelActionModel