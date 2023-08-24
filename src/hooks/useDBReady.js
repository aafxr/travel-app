import {useEffect, useState} from "react";
import expensesDB from "../db/expensesDB/expensesDB";
import travelDB from "../db/travelDB/travelDB";
import storeDB from "../db/storeDB/storeDB";

export default function useDBReady(){
    const [expensesDBReady, setExpensesDBReady] = useState(false)
    const [travelDBReady, setTravelDBReady] = useState(false)
    const [storeDBReady, setStoreDBReady] = useState(false)

    useEffect(() => {
        expensesDB.onReadySubscribe(() => setExpensesDBReady(true))
        travelDB.onReadySubscribe(() => setTravelDBReady(true))
        storeDB.onReadySubscribe(() => setStoreDBReady(true))
    }, [])

    return expensesDBReady && travelDBReady && storeDBReady
}