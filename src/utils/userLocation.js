/**
 * @typedef UserLocationStorageType
 * @property {number} timestamp
 * @property {CoordinatesType} coords
 */

/**
 * возвращает промис, который резолвится с координатами пользователя
 * @returns {Promise<[number, number]>}
 * @function
 * @name userLocation
 * @category Utils
 */
export default function userLocation() {

    return new Promise((resolve, reject) => {
        handleGeoPermission()
            .then(permission => {
                try {
                    /**@type{UserLocationStorageType}*/
                    const prevUserLocation = JSON.parse(localStorage['userLocation'])
                    if (prevUserLocation && Date.now() - prevUserLocation.timestamp < 10000) {
                        resolve(prevUserLocation.coords)
                    } else if (permission && navigator && navigator.geolocation) {
                        navigator.geolocation.getCurrentPosition(loc => {
                                const {coords} = loc
                                const {latitude, longitude} = coords
                                /**@type{UserLocationStorageType}*/
                                const userLocation = {timestamp: Date.now(), coords: [latitude, longitude]}

                                localStorage
                                    .setItem('userLocation', JSON.stringify(userLocation))
                                resolve([latitude, longitude])
                            },
                            reject, {maximumAge: 10000}
                        )
                    } else {
                        reject(new Error('User browser not support geolocation'))
                    }
                } catch (err) {
                }
            })
    })
}

function handleGeoPermission() {
    return navigator.permissions.query({name: "geolocation"}).then((result) => {
        return result.state === "granted";
    });
}