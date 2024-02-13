import {RoadStep} from "./RoadStep";
import {HotelStep} from "./HotelStep";
import {PlaceStep} from "./PlaceStep";
import {APIHotelStep, APIPlaceStep, APIRoadStep, APIRouteType} from "../../../api/fetch/fetchRouteAdvice";

export class Route {
    bestDayTimeEnd: number
    currentTime: number
    date: string //"12-02-2024 - 13-02-2024"
    overTime: number
    position: [number, number]
    price: number
    road: { distance: number, time: number }
    roadTime: number
    score: number
    stepList: string[]
    time: number
    variantCode: string
    steps: Array<RoadStep | HotelStep | PlaceStep>

    constructor(options: Route | APIRouteType) {
        this.bestDayTimeEnd = options.bestDayTimeEnd
        this.currentTime = options.currentTime
        this.date = options.date
        this.overTime = options.overTime
        this.position = [
            Number.parseFloat(options.position[0].toString()),
            Number.parseFloat(options.position[1].toString())
        ]
        this.price = options.price
        this.road = options.road
        this.roadTime = options.roadTime
        this.score = options.score
        this.stepList = options.stepList
        this.time = options.time
        this.variantCode = options.variantCode
        this.steps = options.steps.map(s => {
            if (s.type === 'road')
                return new RoadStep(s as APIRoadStep)
            else if (s.type === 'place')
                return new PlaceStep(s as APIPlaceStep)
            else if (s.type === 'hotel')
                return new HotelStep(s as APIHotelStep)
            else {
                console.error(s)
                throw new Error(`Unexpected step type=${s.type}`)
            }
        })
    }
}