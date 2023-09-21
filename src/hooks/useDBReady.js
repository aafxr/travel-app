import {useEffect, useState} from "react";
import storeDB from "../db/storeDB/storeDB";

/**
 * хук возвращает true, когда дб будет готова к работе
 * @returns {boolean}
 */
export default function useDBReady(){
    const [storeDBReady, setStoreDBReady] = useState(false)

    useEffect(() => {
        storeDB.onReadySubscribe(() => setStoreDBReady(true))
    }, [])

    return storeDBReady
}