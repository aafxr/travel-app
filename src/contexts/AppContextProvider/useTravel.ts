import {useEffect, useState} from "react";
import {useAppContext} from "./useAppContext";
import {Travel} from "../../classes/StoreEntities";

export function useTravel(){
    // const [state, setState] = useState<{ travel: Travel | null }>({travel: null})
    const context =  useAppContext()

    // useEffect(() => {
    //     if(context.travel) setState({travel:context.travel})
    // }, [context.travel])

    return  context.travel
}