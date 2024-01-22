import React, {forwardRef, PropsWithChildren} from "react";
import clsx from "clsx";

import './container.css'

type ContainerPropsType = {
    className?: string
}
/**
 * компонент, задает базовые отступы по бокам
 */
export default forwardRef<HTMLDivElement, PropsWithChildren<ContainerPropsType>>(({children, className}, ref) => {

    return <div ref={ref} className={clsx('container', className)}>
        {children}
    </div>
})

