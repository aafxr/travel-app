export async function subscribeOnPushMessages(){
    if('serviceWorker' in navigator){
        const registration = await navigator.serviceWorker.ready
        const subscription = await registration.pushManager.subscribe()
        const expiresIn = subscription.expirationTime
        const endpoint = subscription.endpoint

        return {expiresIn, endpoint}
    }
}