import {MIN_NO_ADVICE_TIME} from "../../../../static/constants";

import './ShowAdvice.css'
import {Link} from "react-router-dom";
import useTravelContext from "../../../../hooks/useTravelContext";
import {PlusIcon} from "../../../../components/svg";
import {Road} from "../../../../classes/StoreEntities";

type ShowAdvicePropsType = {
    road:Road
}
/**
 *@function
 * @name ShowAdvice
 * @param road
 * @constructor
 */
export default function ShowAdvice({road}: ShowAdvicePropsType){

    // if(prevActivity.isEndEqualToEvening() || prevActivity.isEndAtNight()){
    //     return (
    //         <div className='advice-container advice-container--pt2 link'>
    //             <Link className='align-center gap-1' to={`/travel/${travel.id}/add/hotel/?after=&{}`}>
    //                 Добавить отель
    //                 <span className="advice-icon">
    //                     <PlusIcon  />
    //                 </span>
    //             </Link>
    //         </div>
    //     )
    // }else if(prevActivity.isRoad() && !nextActivity){
    //     return (
    //         <div className='advice-container link'>
    //             <Link className='align-center gap-1' to={`/travel/${travel.id}/add/place/`}>
    //                 Добавить локацию
    //                 <span className="advice-icon">
    //                     <PlusIcon  />
    //                 </span>
    //             </Link>
    //         </div>
    //     )
    // }
    //
    //
    //
    // if(nextActivity.start - prevActivity.end > MIN_NO_ADVICE_TIME){
    //     return (
    //         <div className='advice-container link'>
    //             <Link className='align-center gap-1' to={`/travel/${travel.id}/add/place/`}>
    //                 Добавить локацию
    //                 <span className="advice-icon">
    //                     <PlusIcon  />
    //                 </span>
    //             </Link>
    //         </div>
    //     )
    // }
    return <></>

}