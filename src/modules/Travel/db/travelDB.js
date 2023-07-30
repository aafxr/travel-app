import {LocalDB} from "../../../db/LocalDB";
import schema from "./schema";
import ErrorReport from "../../../controllers/ErrorReport";

const travelDB = new LocalDB(schema, {
    onError: (err) => ErrorReport.sendError(err)
});

export default travelDB