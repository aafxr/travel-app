import clsx from "clsx";
import React, {PropsWithChildren} from "react";
import Container from "../Container/Container";

type PageContainerPropsType = {
    center?: boolean
}

/**
 * Пустой контейнер страници
 * @category Components
 */
export default function PageContainer({center = false, children}: PropsWithChildren<PageContainerPropsType>){
    return (
        <div className='wrapper'>
            <Container className={clsx('content', center && 'center')}>
                {children}
            </Container>
        </div>
    )
}