import {MovementType} from "./MovementType";
import {CoordinatesType} from "./CoordinatesType";

export interface RoadType{
    id: string
    distance: number,
    time_start: Date
    time_end: Date
    movementType: MovementType
    from:CoordinatesType
    to:CoordinatesType
}