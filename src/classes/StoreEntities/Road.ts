import {StoreEntity} from "./StoreEntity";
import {RoadType} from "../../types/RoadType";
import {MovementType} from "../../types/MovementType";
import {nanoid} from "nanoid";
import {CoordinatesType} from "../../types/CoordinatesType";

interface RoadOptionsType extends Partial<RoadType> {
    distance: number
    time_start: Date
    from:CoordinatesType
    to:CoordinatesType
}

const MS_IN_HOUR = 60 * 60 * 1000

export class Road extends StoreEntity implements RoadType {
    id = nanoid(7);
    distance: number;
    movementType: MovementType = MovementType.WALK;
    time_end: Date;
    time_start: Date;
    from: CoordinatesType
    to: CoordinatesType

    constructor(options: RoadOptionsType | Road) {
        super();

        if (options instanceof Road) {
            this.id = options.id
            this.distance = options.distance
            this.movementType = options.movementType
            this.time_end = new Date(options.time_end)
            this.time_start = new Date(options.time_start)
            this.from = options.from
            this.to = options.to
            return
        }

        this.distance = options.distance
        this.time_start = new Date(options.time_start)
        this.from = options.from
        this.to = options.to

        let duration: number
        if (options.distance < 1) {
            duration = options.distance / 3.8 * MS_IN_HOUR;
            this.movementType = MovementType.WALK
        } else if (options.distance < 2) {
            duration = options.distance / 10 * MS_IN_HOUR;
            this.movementType = MovementType.TAXI
        } else if (options.distance < 5) {
            duration = options.distance / 20 * MS_IN_HOUR;
            this.movementType = MovementType.TAXI
        } else if (options.distance < 10) {
            duration = options.distance / 30 * MS_IN_HOUR;
            this.movementType = MovementType.TAXI
        } else {
            duration = options.distance / 40 * MS_IN_HOUR;
            this.movementType = MovementType.CAR
        }

        this.time_end = new Date(this.time_start.getTime() + duration)
    }

    dto(): RoadType {
        return {
            id: this.id,
            distance: this.distance,
            movementType: this.movementType,
            time_end: this.time_end,
            time_start: this.time_start,
            from: this.from,
            to: this.to
        };
    }

}