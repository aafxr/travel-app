import {EXPENSES_FILTER, filterType, local} from "../static/vars";
import Button from "./Button/Button";
import Container from "./Container/Container";
import React from "react";


export default function ExpensesFilterVariant({value, onChange}){
    function setExpensesFilter(variant) {
        if (filterType.includes(variant)) {
            onChange(variant)
            localStorage.setItem(EXPENSES_FILTER, variant)
        }
    }

    return (
        <Container className='footer-btn-container flex-between gap-1'>
        {
            filterType.map(f => (
                <Button key={f} className='center' active={f === value}
                        onClick={() => setExpensesFilter(f)}>{local[f]}</Button>
            ))
        }
    </Container>
    )
}