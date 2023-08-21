export default function CheckIcon({success, ...props}){
    const stroke = success ?'var(--color-green)' : "currentColor"
    return (
        <svg {...props} fill="none"  stroke={stroke} strokeLinecap="round"
             strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" >
            <polyline points="20 6 9 17 4 12"/>
        </svg>
    )
}