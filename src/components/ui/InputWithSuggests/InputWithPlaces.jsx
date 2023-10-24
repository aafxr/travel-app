import {forwardRef} from 'react'

import debounce from "lodash.debounce";
import aFetch from "../../../axios";
import {Input} from "../index";

/**
 * компонент делает запрос на получение рекомендуемых мест для посещения и в случае успеха возвращает результат путем
 * вызова колбэка "onPlaces"
 * @function
 * @name InputWithPlaces
 * @param {function} onPlaces callback, вызывается в случае успешного получения рекомендуемых мест для посещения
 * @param {number} delay время (в миллисекундах) задержки запроса на получение рекомендуемых мест для посещения
 * @param props other props
 * @param {React.Ref} ref react ref
 * @returns {JSX.Element}
 */
function InputWithPlaces({onPlaces, delay = 500, ...props}, ref) {


    /***
     * @param {InputEvent} e
     */
    const handleInputChange = debounce((e) =>  {
        aFetch.post('/places/getList/', {text: e.target.value})
            .then(resp => resp.data)
            .then(resp => {
                console.log(resp)
                if ("ok" in resp && onPlaces)
                    onPlaces(Array.isArray(resp.data) ? resp.data : [])
            })
            .catch(console.error)
        props.onChange && props.onChange(e)
    }, delay, {trailing:true})

    return (
        <Input ref={ref} {...props} onChange={handleInputChange}/>
    )
}

export default forwardRef(InputWithPlaces)
