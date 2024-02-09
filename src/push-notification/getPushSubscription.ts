export async function getPushSubscription(){
    if('serviceWorker' in navigator){
        const registration = await navigator.serviceWorker.ready
        return await registration.pushManager.getSubscription()
    }
}