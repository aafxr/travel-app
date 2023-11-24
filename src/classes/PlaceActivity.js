/**
 * @typedef {ActivityOptionsType} PlaceActivityOptionsType
 * @property {PlaceType} place
 */
import Activity from "./Activity";

export default class PlaceActivity extends Activity{
    /**
     * @param {PlaceActivityOptionsType} options
     */
    constructor(options) {
        super(options)
        if(!options.place)
            throw new Error('PlaceActivity options prop should have "place" prop')

        this.status = Activity.PLACE
        this.place = options.place
    }

    isPlace() {
        return true
    }
}