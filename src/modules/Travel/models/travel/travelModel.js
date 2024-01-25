import Model from "../../../../models/Model";
import constants from "../../../../static/constants";
import travelValidation from "./validation";
import storeDB from "../../../../classes/db/storeDB/storeDB";

const travelModel = new Model(storeDB, constants.store.TRAVEL, travelValidation)

export default travelModel