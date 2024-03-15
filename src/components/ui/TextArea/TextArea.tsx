import clsx from "clsx";
import React, {TextareaHTMLAttributes, useRef} from 'react';

import './TextArea.css';


interface TextAreaPropsType extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'onChange' | 'onSubmit'> {
    // init?: string
    value?: string
    autoResize?: boolean
    onChange?: (text: string) => unknown
    onSubmit?: (text: string) => unknown
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
                                     // init,
                                     onChange,
                                     onSubmit,
                                     ...props
                                 }: TextAreaPropsType) {
    const classNames = clsx('textarea hide-scroll', className);

    let ref = useRef<HTMLTextAreaElement>(null);

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
        // setText(e.target.value)
        if(onChange) onChange(e.target.value)
    }

    function handleKeyUp(e:React.KeyboardEvent<HTMLTextAreaElement>){
        if(props.onKeyUp) props.onKeyUp(e)
        if(!ref.current) return
        if(e.key === 'Enter' && !e.ctrlKey){
            onSubmit?.(ref.current.value)
        }
    }


    return (
        <textarea
            className={classNames}
            ref={ref}
            onKeyUp={handleKeyUp}
            {...props}
            onChange={handleChange}
        ></textarea>
    );
}
