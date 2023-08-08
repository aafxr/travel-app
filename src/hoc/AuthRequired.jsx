import {useContext} from "react";
import {UserContext} from "../contexts/UserContextProvider";
import {useNavigate} from "react-router-dom";

export default function AuthRequired({children}){
    const {user} = useContext(UserContext)
    const navigate = useNavigate()

    if(user){
        return children
    }

    return navigate('/login/')


}