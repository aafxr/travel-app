/**
 *
 * @param {HTMLElement} el
 * @param {number} screenX
 * @param {number} screenY
 */
export default function screenCoordsToBlockCoords(el, screenX, screenY) {
    const xOffset = el.offsetLeft
    const yOffset = el.offsetTop

    const x = screenX - xOffset
    const y = screenY - yOffset

    return {x,y}
}