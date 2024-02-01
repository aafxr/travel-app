import {useNavigate} from "react-router-dom";
import React, {useState} from "react";

import PointInput from "../../../../components/MapPointsInputList/PointInput";
import {useAppContext} from "../../../../contexts/AppContextProvider";
import {YandexMapContainer} from "../../../../components/YandexMap";
import Container from "../../../../components/Container/Container";
import {useTravelState} from "../../../../hooks/useTravelState";
import Button from "../../../../components/ui/Button/Button";
import {WaypointType} from "../../../../types/WaypointType";
import {YPlacemark} from "../../../../components/YandexMap";
import {Waypoint} from "../../../../classes/StoreEntities";
import {PageHeader} from "../../../../components/ui";
import {findAddress} from "./findAddress";

import './TravelAddWaypoint.css'

/**
 * @function
 * @name TravelAddWaypoint
 * @returns {JSX.Element}
 * @category Pages
 */
export default function TravelAddWaypoint() {
    const navigate = useNavigate()
    const context = useAppContext()
    const [point, setPoint] = useState<WaypointType>(new Waypoint({}).dto())


    async function handleKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
        if (e.key === 'Enter') {
            const waypoint = await findAddress(point)
            if (waypoint) {
                setPoint(waypoint)
            }
        }
    }


    async function handleChange(text: string) {
        const address = text.trim()
        setPoint({...point, address})
        if (!address) return
        const waypoint = await findAddress(point)
        if (waypoint) {
            setPoint(waypoint)
        }
    }

    async function handleSearch() {
        const waypoint = await findAddress(point)
        if (waypoint) {
            setPoint(waypoint)
        }
    }


    function handleSave() {
        const travel = context.travel
        if(!travel) return
        if (point.address.length) {
            travel.waypoints.push(new Waypoint(point))
            navigate(`/travel/${travel.id}/map/`)
        }
    }


    function handleBackClick() {
        const travel = context.travel
        if(!travel) return
        navigate(`/travel/${travel.id}/map/`)
    }


    return (
        <div className='wrapper'>
            <Container className='waypoint-container'>
                <PageHeader arrowBack to={handleBackClick} title='Направление'/>
                <div className='column gap-0.5 pb-20'>
                    <PointInput
                        point={point}
                        onKeyDown={handleKeyDown}
                        onInputChange={handleChange}
                        onSearchClick={handleSearch}
                    />
                </div>
            </Container>
            <YandexMapContainer className='content' center={~point.coords[0] ? point.coords : undefined}>
                {Boolean(~point.coords[0]) && (
                    <YPlacemark coordinates={point.coords}/>
                )}
            </YandexMapContainer>
            <div className='fixed-bottom-button'>
                <Button onClick={handleSave} disabled={!~point.coords || !point.address.length}>
                    Продолжить
                </Button>
            </div>
        </div>
    )
}