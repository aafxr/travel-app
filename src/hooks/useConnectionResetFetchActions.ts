import {Context} from "../classes/Context/Context";
import {useAppContext} from "../contexts/AppContextProvider";
import {useEffect} from "react";
import {fetchActions} from "../api/fetch";

export function useConnectionResetFetchActions(){
    const context = useAppContext()

    useEffect(() => {
        async function onOnline(){

        }
    }, [])

}