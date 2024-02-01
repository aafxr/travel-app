export type APIPlaceType = {
        id: string,
        name: string,
        photos?: string[],
        formatted_address: string,
        location: [number, number],
}