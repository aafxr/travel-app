import React, {PropsWithChildren} from "react";
import {Navigate} from "react-router-dom";

import {useAppContext} from "../contexts/AppContextProvider";

/**
 * hoc component обертка, если пользователь не авторизован перенаправляет пользователя на страницу авторизации
 */
export default function AuthRequired({children}:PropsWithChildren) {
    const context = useAppContext()

    // if (loading) {
    //     return (
    //         <PageContainer center>
    //             <Loader className='loader'/>
    //         </PageContainer>
    //     )
    // }

    if (context.user) {
        return <>{children}</>
    }

    return <Navigate to={'/login/'}/>
}