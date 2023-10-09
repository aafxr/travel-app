/**
 * устанавливается фиксированное значение vh (для mobile)
 * @function
 * @name setFixedVH
 * @category Utils
 */
export default function setFixedVH(){
    let vh = window.innerHeight * 0.01
    document.documentElement.style.setProperty('--vh', `${vh}px`)
}