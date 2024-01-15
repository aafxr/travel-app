import {forwardRef, useCallback} from 'react'

import debounce from "lodash.debounce";
import aFetch from "../../../axios";
import {Input} from "../index";

/**
 * компонент делает запрос на получение рекомендуемых мест для посещения и в случае успеха возвращает результат путем
 * вызова колбэка "onPlaces"
 * @function
 * @name InputWithPlaces
 * @param {(places: PlaceType[]) => void} onPlaces callback, вызывается в случае успешного получения рекомендуемых мест для посещения
 * @param {number} delay время (в миллисекундах) задержки запроса на получение рекомендуемых мест для посещения
 * @param props other props
 * @param {React.Ref} ref react ref
 * @returns {JSX.Element}
 */
function InputWithPlaces({onPlaces, value,delay = 500, ...props}, ref) {
    const requestSuggests = (e) =>  {
        const text = e.target.value.trim()
        console.log(e.target.value.trim());
        if(text.length) {
            aFetch.post('/places/getList/', {text})
                .then(resp => resp.data)
                .then(resp => {
                    if ("ok" in resp && onPlaces) {
                        console.log(JSON.stringify(resp.data))
                        onPlaces(Array.isArray(resp.data) ? resp.data : [])
                    }
                })
                .catch(console.error)
        }
    }

    /***
     * @param {InputEvent} e
     */
    const handleInputChange = (e) =>  {
        console.log(e.target.value.trim());
        const t = e.target.value
        requestSuggests(e)
        props.onChange && props.onChange(e)
    }

    return (
        <Input ref={ref} {...props} onChange={handleInputChange}/>
    )
}

export default forwardRef(InputWithPlaces)
