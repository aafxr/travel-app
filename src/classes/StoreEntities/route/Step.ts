type StepOptionsType= {
    day: number
    duration: number
    price?: number
    timeEnd : Date| string | number
    timeStart : Date| string | number
    type: string
}

const timeZoneOffset = new Date().getTimezoneOffset() * 60 *  1000

export class Step{
    day: number = 1
    duration: number = 0
    price: number = 0
    timeEnd = new Date(0)
    timeStart = new Date(0)
    type: string = ''

    constructor(options: StepOptionsType) {
        if(options.day) this.day = options.day
        if(options.duration) this.duration = options.duration
        if(options.price) this.price = options.price
        if(options.timeEnd) {
            this.timeEnd = new Date(options.timeEnd)
            this.timeEnd.setTime(this.timeEnd.getTime() + timeZoneOffset)
        }
        if(options.timeStart) {
            this.timeStart = new Date(options.timeStart)
            this.timeStart.setTime(this.timeStart.getTime() + timeZoneOffset)
        }
        if(options.type) this.type = options.type
    }
}


