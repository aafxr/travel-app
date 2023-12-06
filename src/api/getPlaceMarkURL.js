export default function getPlaceMarkURL(text = ''){
    const svg = `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path fill-rule="evenodd" clip-rule="evenodd" d="M5 9C5 5.13 8.13 2 12 2C15.87 2 19 5.13 19 9C19 14.25 12 22 12 22C12 22 5 14.25 5 9ZM9.5 9${!text ? 'C9.5 10.38 10.62 11.5 12 11.5C13.38 11.5 14.5 10.38 14.5 9C14.5 7.62 13.38 6.5 12 6.5C10.62 6.5 9.5 7.62 9.5 9Z' : ''}" fill="#FF8E09" stroke="white" stroke-width="1"/>
    ${text ? `<text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-size="10" fill="white" >${text}</text>` : ''}
</svg>`
    const blob = new Blob([svg])
    return URL.createObjectURL(blob)
}