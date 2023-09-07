import {useEffect, useState} from "react";
import storeDB from "../db/storeDB/storeDB";

export default function useDBReady(){
    const [storeDBReady, setStoreDBReady] = useState(false)

    useEffect(() => {
        storeDB.onReadySubscribe(() => setStoreDBReady(true))
    }, [])

    return storeDBReady
}