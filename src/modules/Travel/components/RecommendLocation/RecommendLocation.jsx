import React from "react";
import {Link} from "react-router-dom";

import IconButton from "../../../../components/ui/IconButton/IconButton";
import RecommendationCard from "../RecomendationCard/RecommendationCard";
import {PlusIcon} from "../../../../components/svg";

import './RecommendLocation.css'
import ChevronRightIcon from "../../../../components/svg/ChevronRightIcon";
import MapIcon from "../../../../components/svg/MapIcon";
import useTravelContext from "../../../../hooks/useTravelContext";


/**
 * Компоонент отображает рекомендованные места в периоды между активностями
 * @param {string} to
 * @param {Array.<RecommendationItemType>} items
 * @returns {JSX.Element}
 * @constructor
 */
export default function RecommendLocation({to, items }) {
    const {travel} = useTravelContext()

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
                <Link className='travel-link' to={`/travel/${travel.id}/map/`}>
                    <div className='icon'>
                        <MapIcon />
                    </div>
                    Указать на карте <ChevronRightIcon />
                </Link>
                <RecommendationCard to={to} items={items} />
            </div>
        </div>
    )
}