import {CarIcon} from "../svg";
import getDistanceFromTwoPoints from "../../utils/getDistanceFromTwoPoints";
import './ShowDistance.css'

/**
 * @function
 * @name ShowDistance
 * @param {PlaceType} from
 * @param {PlaceType} to
 * @category Components
 */
export default function ShowDistance({from, to}) {
    // const a  = new RoadActivity({from, to})
    // const distance = getDistanceFromTwoPoints(from.coords, to.coords) / 1000


    if (!from || !to) return null
    return (
        <div className='distance-container'>
            <CarIcon className='icon'/>
            <span className='title-semi-bold'></span>
        </div>
    )
}