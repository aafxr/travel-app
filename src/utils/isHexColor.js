/**
 * проверка на коректный HEX цвет пример  #Af15F0b => true
 * @param {string} color
 * @returns {boolean}
 */
export default function isHexColor(color){
    return /^#[0-9a-fA-F]{6}$/.test(color)
}
