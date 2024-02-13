import {useContext} from "react";

import {ExpensesContext} from "./ExpensesContextProvider";
import {useTravel, useUser} from "../AppContextProvider";
import {User} from "../../classes/StoreEntities";

export function useLimit(section_id: string) {
    const expenseContext = useContext(ExpensesContext)
    const user = useUser()
    const travel = useTravel()

    switch (user ? User.getSetting(user, 'expensesFilter') : 'all') {
        case "personal":
            return expenseContext.limits.get(`${user?.id}:${section_id}:${travel?.id}`)
        case "common":
        case "all":
            return expenseContext.limits.get(`${section_id}:${travel?.id}`)
    }
}