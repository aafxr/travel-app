import clsx from "clsx";
import { useLayoutEffect, useRef, useState } from 'react';
import './TextArea.css';

/**
 * Стилезованный компонент textarea
 * @param className
 * @param {React.Ref} textAreaRef
 * @param {boolean} autoResize
 * @param props
 * @returns {JSX.Element}
 * @category UI-Components
 */
export function TextArea({
                             className,
                             textAreaRef,
                             autoResize = true,
                             ...props
                         }) {
    const [minHeight, setMinHeight] = useState(null);

    const classNames = clsx('textarea hide-scroll', className);

    let ref = useRef(null);
    if (textAreaRef) ref = textAreaRef;

    // auto resize
    useLayoutEffect(() => {
        if (!autoResize) return;
        if (!ref || !ref.current) return;
        if (!(ref.current instanceof HTMLTextAreaElement)) return;

        const textAreaEl = ref.current;
        const { offsetHeight, clientHeight } = textAreaEl;

        textAreaEl.style.height = '0';

        // set height 0, to install later scrollHeight
        if (!minHeight) {
            // First text input, save minimum height so textarea doesn't jump
            const currentHeight = offsetHeight;
            textAreaEl.style.height = currentHeight + 5 + 'px';
            setMinHeight(currentHeight);
        } else {
            // leftHeight is needed because scrollHeight with min-height == clientHeight
            const leftHeight = offsetHeight - clientHeight;
            const currentHeight = textAreaEl.scrollHeight - leftHeight;
            textAreaEl.style.height = (currentHeight < minHeight ? minHeight : currentHeight) + 5 + 'px';
        }
    });


    return (
        <textarea
            className={classNames}
            ref={ref}
            {...props}
        ></textarea>
    );
}