import React from "react";
import clsx from "clsx";
import st from './Tab.module.css'

export default function Tab({
                                name,
                                active,
                                className,
                                ...props
                            }) {
    const styles = clsx(
        st.tab,
        {
            [st.active]: !!active,
            className
        }
    )

    return <div className={styles} {...props}>
        {name}
    </div>
}