/**
 * @param {string} type
 * @returns {{onBlur: onBlur, onFocus: onFocus}}
 */
export default function useChangeInputType(type){
    function onFocus(e){
        if(e.target.tagName === 'INPUT' && type){
            e.target.type = type
            e.target.click()
        }
    }

    function onBlur(e){
        if(e.target.tagName === 'INPUT' && type){
            e.target.type = 'text'
        }
    }

    return {
        onFocus,
        onBlur
    }
}