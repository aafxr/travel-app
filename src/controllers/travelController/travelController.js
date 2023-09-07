import ActionController from "../ActionController";
import storeDB from "../../db/storeDB/storeDB";
import options from "./controllerOptions";

const travelController =  new ActionController(storeDB, options)

export default travelController