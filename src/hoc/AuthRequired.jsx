import {Navigate} from "react-router-dom";
import {useSelector} from "react-redux";
import constants from "../static/constants";
import Loader from "../components/Loader/Loader";
import PageContainer from "../components/Loading/PageContainer";
import React from "react";

/**
 * hoc component обертка, если пользователь не авторизован перенаправляет пользователя на страницу авторизации
 */
export default function AuthRequired({children}) {
    const {user, loading} = useSelector(state => state[constants.redux.USER])

    if (loading) {
        return (
            <PageContainer center>
                <Loader className='loader'/>
            </PageContainer>
        )
    }

    if (user || process.env.NODE_ENV === "development") {
        return children
    }

    return <Navigate to={'/login/'}/>
}