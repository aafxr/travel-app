import aFetch from "../../axios";
import {DBFlagType} from "../../types/DBFlagType";
import {Route} from "../../classes/StoreEntities/route/Route";

type PreferencesType = {
    history?: DBFlagType
    nature?: DBFlagType
    party?: DBFlagType
    active?: DBFlagType
    child?: DBFlagType
}


type RequestParamsType = {
    days: number
    density: 1 | 2 | 3
    depth: 1 | 2 | 3
    location: number
    preference: PreferencesType
}

export type APIPlaceType = {
    duration: string
    id: string
    name: string
    photo: string
    popularity: string
    position: [string, string]
    price: string
    rate: string
    score: number
    scoreText: string
    tagRate: { [key: string]: number }
}

export type APIHotelType = {
    id: string
    name: string
    photo: string
    position: [string, string]
    price: string
    rate: string
    tags: any[]
    type: number

}


//steps
export type APIRoadStep = {
    distance: number

    day: number
    duration: number
    price: number
    timeEnd: number
    timeStart: number
    type: 'road'
}

export type APIPlaceStep = {
    place: APIPlaceType
    flag: string

    day: number
    duration: number
    timeEnd: number
    timeStart: number
    type: 'place'
}

export type APIHotelStep = {
    place: APIHotelType
    date: string //"12-02-2024 - 13-02-2024"

    duration: number
    day: number
    timeEnd: number
    timeStart: number
    type: 'hotel'
}

export type APIRouteType = {
    bestDayTimeEnd: number
    currentTime: number,
    date: string //"12-02-2024 - 13-02-2024"
    overTime: number
    position: [string, string]
    price: number,
    road: {
        distance: number,
        time: number
    }
    roadTime: number
    score: number
    stepList: string[]
    time: number
    variantCode: string
    steps: Array<APIRoadStep | APIPlaceStep | APIHotelStep>
}


type ResponseParamsType = {
    places: APIPlaceType[],
    request: RequestParamsType
    routes: APIRouteType[]
}

export async function fetchRouteAdvice(query: RequestParamsType): Promise<Route[]> {
    const response: ResponseParamsType = (await aFetch.post('/travel/wizard/test2.php', query)).data
    console.log(response)
    if (response)
        return response.routes.map(r => new Route(r))
    return []
}