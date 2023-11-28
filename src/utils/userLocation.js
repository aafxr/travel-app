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
                console.log('permission', permission)
                if (permission && navigator && navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(loc => {
                            const {coords} = loc
                            const {latitude, longitude} = coords
                            resolve([latitude, longitude])
                        },
                        reject, {maximumAge: 10000}
                    )
                }
                reject(new Error('User browser not support geolocation'))
            })
    })
}

function handleGeoPermission() {
    return navigator.permissions.query({name: "geolocation"}).then((result) => {
        return result.state === "granted";
    });
}