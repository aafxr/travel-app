export async function subscribeOnPushMessages(){
    if('serviceWorker' in navigator){
        const registration = await navigator.serviceWorker.ready
        const subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: process.env.REACT_APP_PUBLIC_KEY
        })

        const expiresIn = subscription.expirationTime
        const endpoint = subscription.endpoint

        return {expiresIn, endpoint}
    }
}