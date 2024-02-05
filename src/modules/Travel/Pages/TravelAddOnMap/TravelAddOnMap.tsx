import {useNavigate} from "react-router-dom";
import React, {useRef, useState} from "react";

import MapPointsInputList from "../../../../components/MapPointsInputList/MapPointsInputList";
import defaultHandleError from "../../../../utils/error-handlers/defaultHandleError";
import {YandexMapContainer, YPlacemark} from "../../../../components/YandexMap";
import {useAppContext} from "../../../../contexts/AppContextProvider";
import Container from "../../../../components/Container/Container";
import {useTravelState, UseTravelStateType} from "../../../../hooks/useTravelState";
import Button from "../../../../components/ui/Button/Button";
import {WaypointType} from "../../../../types/WaypointType";
import {Waypoint} from "../../../../classes/StoreEntities";
import {TravelService} from "../../../../classes/services";
import {TravelType} from "../../../../types/TravelType";
import {PageHeader} from "../../../../components/ui";
import {findAddress} from "./findAddress";

import './TravelAddOnMap.css'


const initialCallback = (t: TravelType):Partial<TravelType> => {
    const waypoints = [...t.waypoints]
    while (waypoints.length < 2)waypoints.push(new Waypoint({}).dto())
    return {waypoints}
}


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
    const user = context.user
    const navigate = useNavigate()
    const [state, setState] = useTravelState(context.travel, initialCallback )
    const currentWaypoint = useRef<WaypointType | undefined>()
    const [hoverWaypoint, setHoverWaypoint] = useState<WaypointType>()


    async function getNewState(wp:WaypointType){
        if (!state) return
        const newState: UseTravelStateType = {...state, travel: {...state.travel}}
        const idx = newState.travel.waypoints.findIndex(w => w.id === wp.id)
        if (~idx) {
            const waypoint = await findAddress(wp)
            if(waypoint){
                newState.travel.waypoints[idx] = waypoint
                return newState
            }

        }
    }

    /** добавление маршрута с заданными местами для посещения */
    function handleRouteSubmit() {
        const travel = context.travel
        if (!user) return
        if (!state) return
        if (!travel) return
        if (!state.change) return

        travel.waypoints =  state.travel.waypoints
            .filter(w => Boolean(~w.coords[0]) && Boolean(w.address.length))
            .map(w => new Waypoint(w))

        TravelService.update(travel, user)
            .then(() => navigate(`/travel/${travel.id}/settings/`))
            .catch(defaultHandleError)
    }


    function handleRemove(wp: WaypointType) {
        if (!state) return
        const newState: UseTravelStateType = {...state, travel: {...state.travel}}
        if (wp.id === newState.travel.waypoints[0].id) newState.travel.isFromPoint = 0
        const waypoints = newState.travel.waypoints.filter(w => w.id !== wp.id)
        while (waypoints.length < 2) waypoints.push(new Waypoint({}))
        newState.travel.waypoints = waypoints
        setState(newState)
    }

    async function handleBlur(wp: WaypointType) {
        setHoverWaypoint(undefined)
        if (!currentWaypoint.current) return
        if (currentWaypoint.current.address !== wp.address) {
            currentWaypoint.current = undefined
            const newState = await getNewState(wp)
            if (newState) {
                setState(newState)
                setHoverWaypoint(wp)
            }
        }
    }

    function handleFocus(wp: WaypointType) {
        currentWaypoint.current = {...wp}
        if (~wp.coords[0]) setHoverWaypoint(wp)
    }

    function handleHover(wp: WaypointType) {
        if (~wp.coords[0]) setHoverWaypoint(wp)
    }

    function handleShuffle(wps: WaypointType[]) {
        if (!state) return
        const newState: UseTravelStateType = {...state, travel: {...state.travel}}
        newState.travel.waypoints = wps
        setState(newState)
    }

    async function handleSubmit(wp: WaypointType) {
        const newState = await getNewState(wp)
        if (newState) {
            setState(newState)
            setHoverWaypoint(wp)
        }
    }

    async function handleChange(wp: WaypointType) {
        const newState = await getNewState(wp)
        if (newState) {
            setState(newState)
            setHoverWaypoint(wp)
        }
    }

    async function handleAddStartPoint() {
        if (!state) return
        const newState: UseTravelStateType = {...state, travel: {...state.travel}}
        newState.travel.isFromPoint = 1
        newState.travel.waypoints.unshift(new Waypoint({}).dto())
        setState(newState)
    }

    function handleSubmitNewPoint(){
        const travel = context.travel
        if(!travel) return
        if (!state) return
        travel.waypoints =  state.travel.waypoints
            .filter(w => Boolean(~w.coords[0]) && Boolean(w.address.length))
            .map(w => new Waypoint(w))
        navigate(`/travel/${state.travel.id}/add/waypoint/`)
    }

    function isDisabled(){
        if(context.travel?.waypoints.length) return false
        if (state?.change) return false
        return true
    }


    if (!state || !currentTravel) return null

    return (
        <div className='wrapper'>
            <Container className='travel-map pb-20'>
                <PageHeader arrowBack title={'Куда вы хотите поехать?'}/>
                <div className='column gap-0.25'>
                    {!state.travel.isFromPoint && (
                        <div className='link' onClick={handleAddStartPoint}>
                            + Указать откуда начнется поездка
                        </div>
                    )}
                    <MapPointsInputList
                        waypoints={state.travel.waypoints}
                        onRemove={handleRemove}
                        onBlur={handleBlur}
                        onFocus={handleFocus}
                        onHover={handleHover}
                        onShuffle={handleShuffle}
                        onSubmit={handleSubmit}
                        onChange={handleChange}
                    />
                    <div className='link' onClick={handleSubmitNewPoint}>
                        + Добавить точку маршрута
                    </div>
                </div>
            </Container>
            <YandexMapContainer className={'content'} center={hoverWaypoint ? hoverWaypoint.coords : undefined} >
                {state.travel.waypoints
                    .filter(w => Boolean(~w.coords[0]))
                    .map(w => (
                    <YPlacemark key={w.id} coordinates={w.coords}/>
                ))}
            </YandexMapContainer>
            <div className='fixed-bottom-button'>
                <Button onClick={handleRouteSubmit} disabled={isDisabled()}>
                    Продолжить
                </Button>
            </div>
        </div>
    )
}
