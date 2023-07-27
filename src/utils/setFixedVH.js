/**
 * устанавливается фиксированное значение vh (для mobile)
 */
export default function setFixedVH(){
    let vh = window.innerHeight * 0.01
    document.documentElement.style.setProperty('--vh', `${vh}px`)
}