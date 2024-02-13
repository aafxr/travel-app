import {Step} from "./Step";
import {Place} from "../Place";
import {APIPlaceStep} from "../../../api/fetch/fetchRouteAdvice";

export class PlaceStep extends Step{
    type = 'place'
    flag: string
    place: Place

    constructor(options: PlaceStep | APIPlaceStep) {
        super(options);
        this.flag = options.flag
        this.place = new Place(options.place)
    }
}