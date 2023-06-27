import isString from "./validation/isString";


/**
 * @param {string} color
 * @returns {boolean|*|boolean}
 */
export default function isHexColor(color){
    return isString(color) &&  /^#[0-9a-fA-F]{6}$/.test(color)
}