import React from "react";

interface ChatIconProps extends React.SVGProps<SVGSVGElement> {
  badge?: boolean
}

export function ChatIcon({badge = false, ...props}: ChatIconProps) {
  return (
    <svg {...props} viewBox="0 0 24 24" stroke="currentCollor" fill='none' xmlns="http://www.w3.org/2000/svg">
      <path
        d="M21 12C21 16.9706 16.9706 21 12 21C10.2289 21 8.57736 20.4884 7.18497 19.605L3 21L4.39499 16.815C3.51156 15.4226 3 13.7711 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
        strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M16 12H16.002V12.002H16V12Z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M12 12H12.002V12.002H12V12Z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M8 12H8.002V12.002H8V12Z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      {badge && (
        <circle cx="19" cy="5" r="4" fill="#FF0909" stroke='none'/>
      )}
    </svg>
  )
}