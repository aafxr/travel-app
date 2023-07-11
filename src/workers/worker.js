console.log('=========worker=========')


onmessage = function(e){
    console.log('Worker receive data')

    const data = JSON.parse(e.data)

    console.log('[worker] ', data)
    setTimeout(()=>{
        data.data.synced = 1
        postMessage(data.data)
    }, 5000)
}