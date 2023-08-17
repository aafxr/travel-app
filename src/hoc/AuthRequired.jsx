import {Navigate} from "react-router-dom";
import {useSelector} from "react-redux";
import constants from "../static/constants";

export default function AuthRequired({children}){
    const {user} = useSelector(state => state[constants.redux.USER])

    if(user || process.env.NODE_ENV === "development"){
        return children
    }

    return <Navigate to={'/login/'} />
}