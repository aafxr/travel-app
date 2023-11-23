// константы задают скорось передвижения, указанны в м/с
import getDistanceFromTwoPoints from "../utils/getDistanceFromTwoPoints";

const WALK_SPEED = 5 * 1000 / 3600
const CAR_SPEED = 50 * 1000 / 3600
const PUBLIC_TRANSPORT__SPEED = 25 * 1000 / 3600
const PLANE_SPEED = 900 * 1000 / 3600


/**
 * @typedef {'walk' | 'car' | 'plane' | 'publicTransport'} PreferredMovementType
 */

/**
 * @typedef MovementPreferencesOptionsType
 * @property {PlaceType} from
 * @property {PlaceType} to
 * @property {PreferredMovementType[]} movement_type
 * @property {Date} [arrive_at]
 */


export default class Movement {
    /**
     * @param {MovementPreferencesOptionsType} options
     */
    constructor(options) {

        this.from = options.from
        this.to = options.to
        this.distance = getDistanceFromTwoPoints(this.from.coords, this.to.coords)

        if (this.distance < 5 || options.movement_type.includes('walk')) {
            this.speed = WALK_SPEED
            this.movementType = 'walk'
            this.arrive_at = this._calcArriveTime()
        } else if (this.distance < 50 && options.movement_type.includes('publicTransport')) {
            this.speed = PUBLIC_TRANSPORT__SPEED
            this.movementType = 'publicTransport'
            this.arrive_at = this._calcArriveTime()
        } else if (this.distance < 300 && options.movement_type.includes('car')) {
            this.speed = CAR_SPEED
            this.movementType = 'car'
            this.arrive_at = this._calcArriveTime()
        } else if (this.distance > 300 && options.movement_type.includes('plane')) {
            this.speed = PLANE_SPEED
            this.movementType = 'plane'
            if (options.arrive_at)
                this.arrive_at = options.arrive_at
            else
                this.arrive_at = this._calcArriveTime()
        }
    }

    _calcArriveTime() {
        const timeSpentOnRoad_ms = this.distance / this.speed * 1000
        const arrive_at = new Date(this.from.time_end).getTime() + timeSpentOnRoad_ms
        return new Date(arrive_at)
    }


}