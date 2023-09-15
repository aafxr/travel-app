import {Navigate} from "react-router-dom";
import {useSelector} from "react-redux";
import constants from "../static/constants";
import Loader from "../components/Loader/Loader";

export default function AuthRequired({children}) {
    const {user, loading} = useSelector(state => state[constants.redux.USER])

    if (loading) {
        return (
            <div className='wrapper'>
                <div className='content center'>
                    <div className='loader icon'>
                        <Loader/>
                    </div>
                </div>
            </div>
        )
    }

    if (user || process.env.NODE_ENV === "development") {
        return children
    }

    return <Navigate to={'/login/'}/>
}