import clsx from "clsx";
import './BlurBackplate.css'

/**
 * компонент блюрит фон
 * @function
 * @name BlurBackplate
 * @param {React.ReactNode} children
 * @param {string} className
 * @param {React.HTMLAttributes<HTMLDivElement>} props
 * @returns {JSX.Element}
 */
export default function BlurBackplate({children, className, ...props}){
    return (
        <div {...props} className={clsx('blur-backplate ', className)}>
            {children}
        </div>
    )

}