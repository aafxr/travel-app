import StarIcon from "../svg/StarIcon";
import StarHalfIcon from "../svg/StarHalfIcon";

import './Rating.css'

export default function Rating({rating}){
    const rest = rating % 1
    const int = Math.floor(rating)
    let fill = new Array(5).fill(0)

    for(let i = 0; i < fill.length; i++){
        if (i < int){
            fill[i] = <StarIcon className='fill' key={i}/>
        } else if(i === int && rest >= 0.5){
            fill[i] = <StarHalfIcon className='fill-half' key={i}/>
        } else{
            fill[i] = <StarIcon key={i}/>
        }
    }


    return (
        <div className='rating row'>
            {fill}
        </div>
    )
}