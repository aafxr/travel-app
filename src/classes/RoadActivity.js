/**
 * @typedef {ActivityOptionsType} RoadActivityOptionsType
 * @property {PlaceActivity} from
 * @property {PlaceActivity} to
 */
import Activity from "./Activity";
import getDistanceFromTwoPoints from "../utils/getDistanceFromTwoPoints";

export default class RoadActivity extends Activity{
    static WALK_SPEED = 5 * 1000 / 3600
    static CAR_SPEED = 50 * 1000 / 3600
    static PUBLIC_TRANSPORT__SPEED = 25 * 1000 / 3600
    static PLANE_SPEED = 900 * 1000 / 3600
    /**
     * @param {RoadActivityOptionsType} options
     */
    constructor(options) {
        super(options)
        if(!options.from || !options.to)
            throw  new Error('RoadActivity options prop should contain "from" & "to" props')

        this.setPrev(options.from)
        this.setNext(options.to)

        this.distance = getDistanceFromTwoPoints(options.from.place.coords, options.to.place.coords) * 1000

        if(this.distance < 5_000) {
            this.status = Activity.WALK
            this.speed = RoadActivity.WALK_SPEED
        }
        else if (this.distance < 50_000) {
            this.status = Activity.PUBLIC_TRANSPORT
            this.speed = RoadActivity.PUBLIC_TRANSPORT__SPEED
        }
        else if (this.distance > 50_000) {
            this.status = Activity.CAR
            this.speed = RoadActivity.CAR_SPEED
        }
        this.end = new Date(this.distance / this.speed * 1000)
        this.next.shiftTimeBy()
    }

    isGoingToNextActivity() {
        return true
    }

    isPlace() {
        return true
    }
}