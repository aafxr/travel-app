export async function hasPushMessagePermission(){
    if('serviceWorker' in navigator){
        const registration = await window.navigator.serviceWorker.ready
        const state = await registration.pushManager.permissionState()
        if(state === 'granted') return true
    }
    return false
}