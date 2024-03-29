import React from "react";

export function PlayIcon(props:React.SVGProps<SVGSVGElement>){
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fillRule="evenodd" clipRule="evenodd" d="M2 12C2 6.48 6.48 2 12 2C17.52 2 22 6.48 22 12C22 17.52 17.52 22 12 22C6.48 22 2 17.52 2 12ZM16 12L10 7.5V16.5L16 12Z" fill="currentColor" />
    </svg>
  )
}