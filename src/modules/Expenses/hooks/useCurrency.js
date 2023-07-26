import {useEffect, useState} from "react";

export default function useCurrency(){
    const [currency, setCurrency] = useState([])

    useEffect(() => {
        fetch(process.env.REACT_APP_SERVER_URL + '/main/currency/getList/')
            .then(res => res.json())
            .then(data => {
                if (data && data.length){
                    setCurrency(data)
                }
            })
            .catch(console.error)
    }, [])

    return currency
}