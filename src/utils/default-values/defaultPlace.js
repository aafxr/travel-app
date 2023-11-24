/**
 * @return {PlaceType}
 */
export default function defaultPlace() {
    const start = new Date()
    const end = new Date(start.getTime() + 1.5 * 60*60*1000)
    const coords =  [
        50 + Math.random() * 4,
        50 + Math.random() * 4
    ]
    return {
        coords,
        time_start: start.toISOString(),
        time_end: end.toISOString(),
        id: Math.random() * 1_000_000,
        name: 'test',
        _id: Math.random() * 1_000_000,
        location:{
            lat: '' + coords[0],
            lng: '' + coords[1]
        },
        visited: 0,
        formatted_address: '',
        photos: []
    }
}