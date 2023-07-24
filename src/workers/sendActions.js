export default function sendActions(actions, onsuccess, onError) {
    if (actions.length) {
        fetch(process.env.REACT_APP_SERVER_URL + '/expenses/addActions/', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json;charset=utf-8"
            },
            body: JSON.stringify(actions)
        })
            .then(data => {
                if (onsuccess) {
                    onsuccess(data)
                } else {
                    console.log(data)
                }
            })
            .catch(err => {
                if (onError) {
                    onError(err)
                } else {
                    console.error(err)
                }
            })
    }
}