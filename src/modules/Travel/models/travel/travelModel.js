import Model from "../../../../models/Model";
import constants from "../../../../static/constants";
import travelValidation from "./validation";
import travelDB from "../../db/travelDB";

const travelModel = new Model(travelDB, constants.store.TRAVEL, travelValidation)

export default travelModel