/**
 * возвращает промис, который резолвится с координатами пользователя
 * @returns {Promise<[number, number]>}
 */
export default function userPosition(){
    return new Promise((resolve, reject) => {
        if(navigator && navigator.geolocation){
            navigator.geolocation.getCurrentPosition(loc => {
                const {coords} = loc
                const {latitude, longitude} = coords
                resolve([latitude, longitude])
            }, reject, { maximumAge: 10000})
        }
        reject(new Error('User browser not support geolocation'))
    })
}