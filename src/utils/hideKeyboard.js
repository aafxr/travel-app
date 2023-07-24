/**
 *
 * @param {Event} e
 */
export default function hideKeyboard(e){
    if (e.key === 'Enter') {
        const element = e.target
        element.setAttribute('readonly', 'readonly'); // Force keyboard to hide on input field.
        element.setAttribute('disabled', 'true'); // Force keyboard to hide on textarea field.
        setTimeout(function () {
            element.blur();  //actually close the keyboard
            // Remove readonly attribute after keyboard is hidden.
            element.removeAttribute('readonly');
            element.removeAttribute('disabled');
        }, 100);
    }
}