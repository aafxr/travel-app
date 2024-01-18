import React from "react";

export default function CloseIcon(props:React.SVGProps<SVGSVGElement>){
    return (
        <svg {...props} viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
            <defs>
                {/*<style>.cls-1{fill:none;stroke:#000;stroke-linecap:round;stroke-linejoin:round;stroke-width:2px;}</style>*/}
            </defs>
            <title/>
            <g id="cross">
                <line className="cls-1" x1="7" x2="25" y1="7" y2="25" stroke="currentColor" strokeWidth={2}/>
                <line className="cls-1" x1="7" x2="25" y1="25" y2="7" stroke="currentColor" strokeWidth={2}/>
            </g>
        </svg>
    )
}