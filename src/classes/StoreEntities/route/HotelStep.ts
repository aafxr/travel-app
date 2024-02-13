import {Step} from "./Step";
import {Hotel} from "./Hotel";
import {APIHotelStep} from "../../../api/fetch/fetchRouteAdvice";


export class HotelStep extends Step{
    type = 'hotel'
    place: Hotel
    date: string

    constructor(options: HotelStep | APIHotelStep) {
        super(options);
        this.date = options.date
        this.place = new Hotel(options.place)
    }
}