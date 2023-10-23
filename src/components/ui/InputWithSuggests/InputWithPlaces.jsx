import {Input} from "../index";
import aFetch from "../../../axios";

export default function InputWithPlaces({onPlaces, ...props}) {

    /**
     *
     * @param {InputEvent} e
     */
    function handleInputChange(e) {
        aFetch.post('/places/getList/', {text: e.target.value})
            .then(resp => resp.data)
            .then(resp => {
                console.log(resp)
                if ("ok" in resp && onPlaces)
                    onPlaces(Array.isArray(resp.data) ? resp.data : [])

            })
            .catch(console.error)
        props.onChange && props.onChange(e)
    }

    return (
        <Input {...props} onChange={handleInputChange}/>
    )
}