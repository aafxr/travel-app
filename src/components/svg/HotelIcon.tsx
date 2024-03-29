import React from "react";

export function HotelIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fillRule="evenodd" clipRule="evenodd"
         d="M11 7H19C21.21 7 23 8.79 23 11V20H21V17H3V20H1V5H3V14H11V7ZM10 10C10 11.66 8.66 13 7 13C5.34 13 4 11.66 4 10C4 8.34 5.34 7 7 7C8.66 7 10 8.34 10 10Z"
         fill="currentColor"/>
    </svg>
  )
}
