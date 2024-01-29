import React, {PropsWithChildren} from "react";
import {Navigate} from "react-router-dom";

import {useUser} from "../contexts/AppContextProvider";

/**
 * hoc component обертка, если пользователь не авторизован перенаправляет пользователя на страницу авторизации
 */
export default function AuthRequired({children}:PropsWithChildren) {
    const user = useUser()

    // if (loading) {
    //     return (
    //         <PageContainer center>
    //             <Loader className='loader'/>
    //         </PageContainer>
    //     )
    // }

    if (user) {
        return <>{children}</>
    }

    return <Navigate to={'/login/'}/>
}