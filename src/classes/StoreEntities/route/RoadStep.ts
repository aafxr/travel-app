import {Step} from "./Step";
import {APIRoadStep} from "../../../api/fetch/fetchRouteAdvice";

export class RoadStep extends Step{
    type = 'road'
    distance = 0

    constructor(options: RoadStep | APIRoadStep) {
        super(options);
        if(options.distance) this.distance = options.distance
    }
}