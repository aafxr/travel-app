import ActionController from "../../../controllers/ActionController";
import travelDB from "../db/travelDB";
import options from "./controllerOptions";

const travelController =  new ActionController(travelDB, options)

export default travelController