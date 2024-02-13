import {APIPlaceType} from "../../../api/fetch/fetchRouteAdvice";

export class Place{
    id: string
    name: string
    photo: string
    duration: number
    popularity: number
    position: [number,number]
    price: number
    rate: number
    score: number
    scoreText: string
    tagRate: { [key:string]: number }

    constructor(options: Place | APIPlaceType) {
        this.id = options.id
        this.name = options.name
        this.photo = options.photo
        this.duration = Number.parseFloat(options.duration.toString())
        this.popularity = Number.parseFloat(options.popularity.toString())
        this.position = [
            Number.parseFloat(options.position[0].toString()),
            Number.parseFloat(options.position[1].toString())
        ]
        this.price = Number.parseFloat(options.price.toString())
        this.rate = Number.parseFloat(options.rate.toString())
        this.score = options.score
        this.scoreText = options.scoreText
        this.tagRate = options.tagRate
    }
}