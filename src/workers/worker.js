console.log('=========worker=========')


onmessage = function(e){
    console.log('Worker receive data')

    const data = JSON.parse(e.data)

    console.log('[worker] ', data)
    postMessage('from ' + data.module)
}