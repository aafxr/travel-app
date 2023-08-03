import {Link} from "react-router-dom";
import './RecommendationCard.css'

/**
 * @typedef {Object} RecommendationItemType
 * @property {string} id
 * @property {string} entityType
 * @property {string} entityName
 */

/**
 * Компоонент отображает рекомендованные места в периоды между активностями
 * @param {string} to
 * @param {Array.<RecommendationItemType>} items
 * @returns {JSX.Element}
 * @constructor
 */
export default function RecommendationCard({to = '', items}){

    return (
        <div className='recommendation-card column gap-0.5'>
            <div className='flex-between'>
                <span className='title-bold'>По пути</span><Link to={to} className='link'>Еще</Link>
            </div>
            {
                items && !!items.length && items.map(item => (
                    <RecommendationItem key={item.id} {...item}/>
                ))
            }
        </div>
    )
}


function RecommendationItem({entityType, entityName}){

    return (
        <div className='recommendation-item column gap-0.25'>
            <div className='recommendation-item-entity'>{entityType}</div>
            <div className='recommendation-item-title'>{entityName}</div>
        </div>
    )
}