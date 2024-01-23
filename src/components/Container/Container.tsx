import React, {forwardRef, PropsWithChildren} from "react";
import clsx from "clsx";

import './container.css'
import Loader from "../Loader/Loader";

type ContainerPropsType = {
    className?: string
    loading?: boolean
}
/**
 * компонент, задает базовые отступы по бокам
 */
export default forwardRef<HTMLDivElement, PropsWithChildren<ContainerPropsType>>(({
                                                                                      children,
                                                                                      className,
                                                                                      loading = false
                                                                                  }, ref) => {
    if (loading)
        return (
            <div ref={ref} className={clsx('container center', className)}>
                <Loader/>
            </div>
        )

    return (
        <div ref={ref} className={clsx('container', className)}>
            {children}
        </div>
    )
})

