import ActionController from "../ActionController";
import travelDB from "../../db/travelDB/travelDB";
import options from "./controllerOptions";

const travelController =  new ActionController(travelDB, options)

export default travelController