import {Navigate} from "react-router-dom";
import {useSelector} from "react-redux";
import constants from "../static/constants";

export default function AuthRequired({children}){
    const {user, loading} = useSelector(state => state[constants.redux.USER])

    if (loading){
        return null
    }

    if(user || process.env.NODE_ENV === "development"){
        return children
    }

    return <Navigate to={'/login/'} />
}