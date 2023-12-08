import React, {useContext} from "react";
import {Navigate} from "react-router-dom";
import Loader from "../components/Loader/Loader";
import PageContainer from "../components/Loading/PageContainer";
import {UserContext} from "../contexts/UserContextProvider";

/**
 * hoc component обертка, если пользователь не авторизован перенаправляет пользователя на страницу авторизации
 */
export default function AuthRequired({children}) {
    const {user, loading} = useContext(UserContext)

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