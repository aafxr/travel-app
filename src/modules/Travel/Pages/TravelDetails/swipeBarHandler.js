/**
 *
 * @param {Element} el
 */
export default function swipeBarHandler(el){
        const isScrolled = el.classList.contains('scrolled')

        el.classList.toggle('scrolled')
        el.style.offsetTop = '0'

        if (isScrolled){
            el.style.top = '0'
        } else {
            el.style.top = '95%'
        }
}