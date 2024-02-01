import type {IGeocodeResult} from "ymaps/index";

type YAPIResponseType = {
    address: string,
    boundedBy: [[number, number], [number, number]]
} | {
    empty: true
}

export async function findByAddress(address: string): Promise<YAPIResponseType>{
    return {
        address:"Moscow area",
        boundedBy:[[54,35], [54,35]]
    }
    // const result: IGeocodeResult = await window.ymaps.geocode(address)
    // return extractAPIData(result)
}


export async function findByCoordinates(coords: [number, number]): Promise<YAPIResponseType>{
    const result = await window.ymaps.geocode(coords)
    return extractAPIData(result)
}


function extractAPIData(response: IGeocodeResult): YAPIResponseType {
    const address = response.geoObjects.get(0).properties.get('text', {}) as string | object
    if(typeof address === 'string'){
        const boundedBy = response.geoObjects.get(0).properties.get('boundedBy', {}) as [[number, number], [number, number]]
        return {address, boundedBy}
    }
    return {empty:true}
}