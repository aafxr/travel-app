import {LocalDB} from "../LocalDB";
import schema from "./schema";
import ErrorReport from "../../../controllers/ErrorReport";

const storeDB = new LocalDB(schema, {
    onError: (err) => ErrorReport.sendError(err)
});


