import React from "react";
import {Link} from "react-router-dom";

import IconButton from "../../../../components/ui/IconButton/IconButton";
import RecommendationCard from "../RecomendationCard/RecommendationCard";
import {PlusIcon} from "../../../../components/svg";

import './RecommendLocation.css'
import ChevronRightIcon from "../../../../components/svg/ChevronRightIcon";


/**
 * Компоонент отображает рекомендованные места в периоды между активностями
 * @param {string} to
 * @param {Array.<RecommendationItemType>} items
 * @returns {JSX.Element}
 * @constructor
 */
export default function RecommendLocation({to, items }) {

    return (
        <div className='recommend-location'>
            <IconButton
                className='recommend-location-add'
                icon={<PlusIcon/>}
                bgVariant='bg-default'
                border={false}
                shadow
            />
            <div className='column gap-0.5'>
                <Link className='travel-link' to={''}>
                    <div className='icon'>
                        <img className={'img-abs'} src={process.env.PUBLIC_URL + '/icons/map.svg'} alt="map"/>
                    </div>
                    Указать на карте <ChevronRightIcon />
                </Link>
                <RecommendationCard to={to} items={items} />
            </div>
        </div>
    )
}