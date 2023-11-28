import React, {forwardRef} from "react";
import clsx from "clsx";

import './container.css'

/**
 * @typedef ContainerPropsType
 * @property children
 * @property {string} className css class
 */

/**
 * компонент, задает базовые отступы по бокам
 * @param {ContainerPropsType} props
 * @param {React.Ref<HTMLDivElement>} ref
 */
 function Container({children, className}, ref) {

    return <div ref={ref} className={clsx('container', className)}>
        {children}
    </div>
}

export default forwardRef(Container)

