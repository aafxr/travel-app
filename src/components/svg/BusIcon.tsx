import React from "react";

export function BusIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fillRule="evenodd" clipRule="evenodd"
         d="M5 18.22C4.39 17.67 4 16.88 4 16V6C4 2.5 7.58 2 12 2C16.42 2 20 2.5 20 6V16C20 16.88 19.61 17.67 19 18.22V20C19 20.55 18.55 21 18 21H17C16.45 21 16 20.55 16 20V19H8V20C8 20.55 7.55 21 7 21H6C5.45 21 5 20.55 5 20V18.22ZM6 15.5C6 16.33 6.67 17 7.5 17C8.33 17 9 16.33 9 15.5C9 14.67 8.33 14 7.5 14C6.67 14 6 14.67 6 15.5ZM16.5 17C15.67 17 15 16.33 15 15.5C15 14.67 15.67 14 16.5 14C17.33 14 18 14.67 18 15.5C18 16.33 17.33 17 16.5 17ZM6 11H18V6H6V11Z"
         fill="currentColor"/>
    </svg>
  )
}