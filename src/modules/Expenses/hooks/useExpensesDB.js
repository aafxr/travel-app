import {useEffect, useState} from "react";
import expensesDB from "../../../db/expensesDB/expensesDB";

/**
 * @returns {{expensesDB: LocalDB, ready: boolean}}
 */
export default function useExpensesDB(){
    const [ready, setReady] = useState(false)

    useEffect(() => {
        expensesDB.onReadySubscribe(() => setReady(true))
    }, [])

    return {
        expensesDB,
        ready
    }
}