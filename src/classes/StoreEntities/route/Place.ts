import {APIPlaceType} from "../../../api/fetch/fetchRouteAdvice";

export class Place {
    id: string
    name: string
    photo: string
    duration: number = 0
    popularity: number = 0
    position: [number, number]
    price: number = 0
    rate: number
    score: number
    scoreText: string
    tagRate: { [key: string]: number }

    constructor(options: Place | APIPlaceType) {
        this.id = options.id
        this.name = options.name
        this.photo = options.photo
        this.duration = Number.parseFloat(options.duration + '')
        this.popularity = Number.parseFloat(options.popularity + '')
        this.position = [
            Number.parseFloat(options.position[0] + ''),
            Number.parseFloat(options.position[1] + '')
        ]
        if (options.price !== undefined && options.price !== null) this.price = Number.parseFloat(options.price + '')
        this.rate = Number.parseFloat(options.rate + '')
        this.score = options.score
        this.scoreText = options.scoreText
        this.tagRate = options.tagRate
    }
}