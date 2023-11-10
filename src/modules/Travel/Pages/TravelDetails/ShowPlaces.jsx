import React from "react";
import {useParams} from "react-router-dom";

import LocationCard from "../../components/LocationCard/LocationCard";
import Container from "../../../../components/Container/Container";
import useTravelContext from "../../../../hooks/useTravelContext";
import {DEFAULT_IMG_URL} from "../../../../static/constants";
import {Tab} from "../../../../components/ui";

export default function ShowPlaces() {
    const {dayNumber} = useParams()
    const {travel} = useTravelContext()


    return (
        <>
            {
                <div className='travel-tab-container flex-stretch flex-nowrap hide-scroll'>
                    {
                        travel.routeBuilder.getActivityDays()
                            .sort()
                            .map((i) => (
                                <Tab to={`/travel/${travel.id}/${i}/`} key={i} name={`${i} день`}/>
                            ))
                    }
                </div>
            }
            <Container className='column overflow-x-hidden pt-20 pb-20 gap-1'>
                {
                    travel.routeBuilder.getRouteByDay(+dayNumber || 1).map(p => (
                        <LocationCard
                            key={p.id}
                            id={p.id}
                            title={p.name}
                            imgURLs={p.photos || [DEFAULT_IMG_URL]}
                            entityType={p.formatted_address}
                        />
                    ))
                }
            </Container>
        </>
    )
}