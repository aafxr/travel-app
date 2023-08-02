import {EXPENSES_FILTER, filterType, local} from "../static/vars";
import Button from "../../../components/ui/Button/Button";
import Container from "../../../components/Container/Container";
import React from "react";
import clsx from "clsx";


export default function ExpensesFilterVariant({value , onChange, className}){
    function setExpensesFilter(variant) {
        if (filterType.includes(variant)) {
            onChange(variant)
            localStorage.setItem(EXPENSES_FILTER, variant)
        }
    }

    return (
        <Container className={clsx('footer-btn-container flex-between gap-1', className)}>
        {
            filterType.map(f => (
                <Button key={f} className='center' active={f === value}
                        onClick={() => setExpensesFilter(f)}>{local[f]}</Button>
            ))
        }
    </Container>
    )
}