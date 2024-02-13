import {APIHotelType} from "../../../api/fetch/fetchRouteAdvice";

export class Hotel{
    id: string
    name: string
    photo: string
    position: [number,number]
    price: number
    rate: number
    tags:any[]
    type: number

    constructor(options: Hotel | APIHotelType) {
        this.id = options.id
        this.name = options.name
        this.photo = options.photo
        this.position = [
            Number.parseFloat(options.position[0].toString()),
            Number.parseFloat(options.position[1].toString())
        ]
        this.price = Number.parseFloat(options.price.toString())
        this.rate = Number.parseFloat(options.rate.toString())
        this.tags = options.tags
        this.type = options.type
    }
}