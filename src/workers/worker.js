console.log('=========worker=========')


onmessage = function(e){

    const data = JSON.parse(e.data)

        data.data.synced = 1
        postMessage(data.data)
}