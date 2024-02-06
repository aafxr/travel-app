import React from "react";
import clsx from "clsx";
import {filterType, local} from "../static/vars";
import Button from "../../../components/ui/Button/Button";
import Container from "../../../components/Container/Container";
import {useAppContext, useUser} from "../../../contexts/AppContextProvider";
import {ExpenseFilterType} from "../../../types/filtersTypes";
import {User} from "../../../classes/StoreEntities";


export default function ExpensesFilterVariant({className}: { className?: string }) {
    const context = useAppContext()
    const user = useUser()

    function setExpensesFilter(variant: ExpenseFilterType) {
        if (!user) return
        User.setExpenseFilter(user, variant)
        context.setUser(user)
    }

    if (!user) return null

    return (
        <Container className={clsx('footer-btn-container flex-between gap-1', className)}>
            {
                filterType.map(f => (
                    <Button
                        key={f} className='center'
                        active={f === User.getSetting(user, 'expensesFilter')}
                        onClick={() => setExpensesFilter(f)}
                    >
                        {local[f]}
                    </Button>
                ))
            }
        </Container>
    )
}