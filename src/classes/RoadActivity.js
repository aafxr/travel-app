/**
 * @typedef {ActivityOptionsType} RoadActivityOptionsType
 * @property {PlaceActivity} from
 * @property {PlaceActivity} to
 */
import Activity from "./Activity";
import getDistanceFromTwoPoints from "../utils/getDistanceFromTwoPoints";
import dateToStringFormat from "../utils/dateToStringFormat";

export default class RoadActivity extends Activity {
    static WALK_SPEED = 5 * 1000 / 3600
    static CAR_SPEED = 50 * 1000 / 3600
    static PUBLIC_TRANSPORT__SPEED = 25 * 1000 / 3600
    static PLANE_SPEED = 900 * 1000 / 3600

    /**
     * @param {RoadActivityOptionsType} options
     */
    constructor(options) {
        super(options)
        if (!options.from || !options.to)
            throw  new Error('RoadActivity options prop should contain "from" & "to" props')

        this.setPrev(options.from)
        this.setNext(options.to)

        this.distance = getDistanceFromTwoPoints(options.from.place.coords, options.to.place.coords) * 1000

        if (this.distance < 5_000) {
            this.status = Activity.WALK
            this.speed = RoadActivity.WALK_SPEED
        } else if (this.distance < 50_000) {
            this.status = Activity.PUBLIC_TRANSPORT
            this.speed = RoadActivity.PUBLIC_TRANSPORT__SPEED
        } else if (this.distance > 50_000) {
            this.status = Activity.CAR
            this.speed = RoadActivity.CAR_SPEED
        }
    }

    _init() {
        this.start = new Date(this.prev.end.getTime())
        this.duration = (this.distance / this.speed) * 1000
        this.end = new Date(this.start.getTime() + this.duration)
        this.next.shiftTimeBy()
    }

    isGoingToNextActivity() {
        return true
    }

    isPlace() {
        return true
    }

    toString() {


        let emoji

        if (this.speed === RoadActivity.WALK_SPEED)
            emoji = '🚶🏻‍♂️'
        else if (this.speed === RoadActivity.CAR_SPEED)
            emoji = '🚗💨'
        else if (this.speed === RoadActivity.PUBLIC_TRANSPORT__SPEED)
            emoji = '🚌💨'

        return `
        ==================
        День ${this.days}
        
        В пути ${emoji}
        Начало: ${dateToStringFormat(this.start.toISOString())}
        Заккончится: ${dateToStringFormat(this.end.toISOString())}
        Дистанция: ${Math.round(this.distance)} м
        Сккорость: ${this.speed.toFixed(2)} м/с
        Время в пути: ${this.toTimeStingFormat()}
        
        ==================
        `
    }

    shiftTimeBy(ms) {
        super.shiftTimeBy(ms)
        if (this.next) this.next.shiftTimeBy(ms)
    }

    setEnd(time) {
        const date = new Date(time)
        if (!Number.isNaN(date.getTime()))
            return this;
    }

    setStart(time) {
        return this;
    }
}