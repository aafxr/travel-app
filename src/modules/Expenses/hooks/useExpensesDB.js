import {useEffect, useState} from "react";
import storeDB from "../../../classes/db/storeDB/storeDB";

/**
 * @returns {{storeDB: LocalDB, ready: boolean}}
 */
export default function usestoreDB(){
    const [ready, setReady] = useState(false)

    useEffect(() => {
        storeDB.onReadySubscribe(() => setReady(true))
    }, [])

    return {
        storeDB,
        ready
    }
}