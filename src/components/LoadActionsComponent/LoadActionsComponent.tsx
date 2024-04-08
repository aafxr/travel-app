import {useConnectionResetFetchActions} from "../../hooks/useConnectionResetFetchActions";
import {useAppContext, useTravel, useUser} from "../../contexts/AppContextProvider";
import {Recover} from "../../classes/Recover";
import {Outlet} from "react-router-dom";


/**
 * компонент добавляет логику загрузки actions с сервера при востановлении интернет соединения
 * @constructor
 */
export default function LoadActionsComponent() {
    const user = useUser()
    const travel = useTravel()
    const context = useAppContext()

    useConnectionResetFetchActions({
        onTravelAction: async () => {
            if (!travel) return
            const t = await Recover.travel(travel.id)
            context.setTravel(t)
        },
        onExpenseAction: async () => {
            if (!travel || !user) return
            // await Recover.expense(travel.id, user)
        }
    })

    return <Outlet />
}