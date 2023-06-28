import React from 'react'
import clsx from 'clsx'
import st  from './style.module.css'

export default ({
    color = 'orange', // 'orange' | 'green' | 'gray' | 'light-orange'
    icon,
    iconPosition = 'left',// 'left' | 'right'
    children,
    rounded,// boolean
    className,
    ...props

})=>{
    const classes = clsx({
        [st.chip]: true,
        [st.icon]: icon,
        [st.orange]: color === 'orange',
        [st.green]: color === 'green',
        [st['gray']]: color === 'gray',
        [st['light-orange']]: color === 'light-orange',
        [st['icon-left']]: icon && iconPosition === 'left',
        [st['icon-right']]: icon && iconPosition === 'right',
        [st.rounded]: rounded,
        className
    })

    return <div className={classes} {...props}>
        {typeof icon === 'string' && icon.length > 0 && <img src={icon} alt="icon"/> }
        {children}
    </div>
}