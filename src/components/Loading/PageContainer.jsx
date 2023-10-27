import React from "react";
import Loader from "../Loader/Loader";
import Container from "../Container/Container";
import clsx from "clsx";

/**
 * Пустой контейнер страници
 * @function
 * @name PageContainer
 * @param {boolean} center default = false
 * @returns {JSX.Element}
 * @category Components
 */
export default function PageContainer({center = false, children}){
    return (
        <div className='wrapper'>
            <Container className={clsx('content', center && 'center')}>
                {children}
            </Container>
        </div>
    )
}