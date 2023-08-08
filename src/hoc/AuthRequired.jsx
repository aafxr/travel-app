import {useContext} from "react";
import {UserContext} from "../contexts/UserContextProvider";
import {Navigate} from "react-router-dom";

export default function AuthRequired({children}){
    const {user} = useContext(UserContext)

    if(user){
        return children
    }

    return <Navigate to={'/login/'} />
}