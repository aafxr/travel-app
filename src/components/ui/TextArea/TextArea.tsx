import clsx from "clsx";
import React, {TextareaHTMLAttributes, useEffect, useRef, useState} from 'react';
import './TextArea.css';


interface TextAreaPropsType extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'onChange'> {
    init?: string
    value?: string
    autoResize?: boolean
    onChange?: (text: string) => unknown
}

/**
 * Стилезованный компонент textarea
 * @function
 * @param className css class
 * @param value
 * @param onChange
 * @param {boolean} autoResize default = true, автоматический пересчет высоты компонента при изменении контента
 * так, чтобы весь контент помещался в область textarea
 * @param props other props for textarea
 * @returns {JSX.Element}
 * @category UI-Components
 */
export default function TextArea({
                                     className,
                                     autoResize = true,
                                     init,
                                     onChange,
                                     ...props
                                 }: TextAreaPropsType) {
    const [text, setText] = useState('')
    // const [minHeight, setMinHeight] = useState(0);

    const classNames = clsx('textarea hide-scroll', className);

    let ref = useRef<HTMLTextAreaElement>(null);


    useEffect(() => {
        if (init)
            setText(init)
    }, [])



    // auto resize
    // useLayoutEffect(() => {
    //     if (!autoResize) return;
    //     if (!ref || !ref.current) return;
    //     if (!(ref.current instanceof HTMLTextAreaElement)) return;
    //
    //     const textAreaEl = ref.current;
    //     const {offsetHeight, clientHeight} = textAreaEl;
    //
    //     textAreaEl.style.height = '0';
    //
    //     // set height 0, to install later scrollHeight
    //     if (!minHeight) {
    //         // First text input, save minimum height so textarea doesn't jump
    //         const currentHeight = offsetHeight;
    //         textAreaEl.style.height = currentHeight + 5 + 'px';
    //         setMinHeight(currentHeight);
    //     } else {
    //         // leftHeight is needed because scrollHeight with min-height == clientHeight
    //         const leftHeight = offsetHeight - clientHeight;
    //         const currentHeight = textAreaEl.scrollHeight - leftHeight;
    //         textAreaEl.style.height = (currentHeight < minHeight ? minHeight : currentHeight) + 5 + 'px';
    //     }
    // });


    function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
        setText(e.target.value)
        if(onChange) onChange(e.target.value)
    }


    return (
        <textarea
            className={classNames}
            ref={ref}
            {...props}
            value={text}
            onChange={handleChange}
        ></textarea>
    );
}
