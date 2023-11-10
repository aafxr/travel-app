import useTravelContext from "../../../../hooks/useTravelContext";
import LocationCard from "../../components/LocationCard/LocationCard";
import {DEFAULT_IMG_URL} from "../../../../static/constants";
import React from "react";
import {useParams} from "react-router-dom";
import {Tab} from "../../../../components/ui";
import Container from "../../../../components/Container/Container";

export default function ShowPlaces() {
    const {dayNumber} = useParams()
    const {travel} = useTravelContext()

    console.log(travel.routeBuilder.getRouteByDay(+dayNumber || 1))
    return (
        <>
            {
                <div className='travel-tab-container flex-stretch flex-nowrap hide-scroll'>
                    {
                        travel.routeBuilder.getDaysWithActivity()
                            .sort()
                            .map((i) => (
                                <Tab to={`/travel/${travel.id}/${i }/`} key={i} name={`${i} день`}/>
                            ))
                    }
                </div>
            }
            <Container className='overflow-x-hidden pt-20 pb-20'>
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