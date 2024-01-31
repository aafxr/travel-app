import {useNavigate} from "react-router-dom";
import React from "react";

import MapPointsInputList from "../../../../components/MapPointsInputList/MapPointsInputList";
import defaultHandleError from "../../../../utils/error-handlers/defaultHandleError";
import {YandexMapContainer, YPlacemark} from "../../../../components/YandexMap";
import {useAppContext} from "../../../../contexts/AppContextProvider";
import Container from "../../../../components/Container/Container";
import {useTravelState} from "../../../../hooks/useTravelState";
import Button from "../../../../components/ui/Button/Button";
import {WaypointType} from "../../../../types/WaypointType";
import {TravelService} from "../../../../classes/services";
import {PageHeader} from "../../../../components/ui";
import StartPointInput from "./StartPointInput";

import './TravelAddOnMap.css'
import {Waypoint} from "../../../../classes/StoreEntities";


/**
 * Страница формирования мест маршрута с картой
 * @function
 * @name TravelAddOnMap
 * @returns {JSX.Element|null}
 * @category Pages
 */
export default function TravelAddOnMap() {
    const context = useAppContext()
    const currentTravel = context.travel
    const navigate = useNavigate()
    const [state, setState] = useTravelState(context.travel)

    // const {points, setPoints} = usePoints(map)

    /** добавление маршрута с заданными местами для посещения */
    function handleRouteSubmit() {
        const travel = context.travel
        if (!travel) return
        if (!state) return
        if (!state.change) return

        Object.assign(travel, state.travel)

        const waypoints  = Array.from({length: 3}).map(() => new Waypoint({}).dto())

        setState({travel: {...state.travel, waypoints }, change: false})

        TravelService.update(context, travel)
            .then(() => navigate(`/travel/${travel.id}/settings/`))
            .catch(defaultHandleError)
    }


    /** обработка изменения списка точек ( добавлена / удалена / переставленна) */
    function handlePointListChange(waypoints: WaypointType[]) {
        if (!state) return
        setState({...state, travel: {...state.travel, waypoints}})
    }


    if(!state || !currentTravel) return null

    return (
        <div className='wrapper'>
            <Container className='travel-map pb-20'>
                <PageHeader arrowBack title={'Куда вы хотите поехать?'}/>
                <div className='column gap-0.5'>
                    <StartPointInput
                        waypoint={state.travel.isFromPoint ? state.travel.waypoints[0] : undefined}
                        onChange={console.log}
                        onRemove={console.log}
                    />
                    <MapPointsInputList
                        waypoints={state.travel.isFromPoint ? state.travel.waypoints.slice(1) : state.travel.waypoints}
                        onChange={handlePointListChange}
                    />
                </div>
            </Container>
                <YandexMapContainer className={'content'}>
                    {state.travel.waypoints.map(w => (
                        <YPlacemark key={w.id} coordinates={w.coords}/>
                    ))}
                </YandexMapContainer>
            <div className='fixed-bottom-button'>
                <Button onClick={handleRouteSubmit} disabled={state ? state.change : true}>
                    Продолжить
                </Button>
            </div>
        </div>
    )
}
