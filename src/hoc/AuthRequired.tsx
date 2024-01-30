import React from "react";
import {Navigate, Outlet} from "react-router-dom";

import {useAppContext} from "../contexts/AppContextProvider";

/**
 * hoc component обертка, если пользователь не авторизован перенаправляет пользователя на страницу авторизации
 */
export default function AuthRequired() {
    const context = useAppContext()

    // if (loading) {
    //     return (
    //         <PageContainer center>
    //             <Loader className='loader'/>
    //         </PageContainer>
    //     )
    // }

    if (context.user) {
        return <Outlet/>
    }

    return <Navigate to={'/login/'}/>
}