import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import {useEffect, useRef, useState} from "react";

import YandexMapContainer from "../../../../components/YandexMapContainer/YandexMapContainer";
import MapControls from "../../../../components/MapControls/MapControls";
import {pushAlertMessage} from "../../../../components/Alerts/Alerts";
import Container from "../../../../components/Container/Container";
import Button from "../../../../components/ui/Button/Button";
import {Input, PageHeader} from "../../../../components/ui";
import storeDB from "../../../../db/storeDB/storeDB";
import constants from "../../../../static/constants";
import createId from "../../../../utils/createId";
import {actions} from "../../../../redux/store";
import useTravel from "../../hooks/useTravel";

import './TravelAddWaypoint.css'

export default function TravelAddWaypoint() {
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const {user, userLoc} = useSelector(state => state[constants.redux.USER])
    const {travel, errorMessage} = useTravel()

    /** интерфейс для взаимодействия с картой */
    const [map, setMap] = useState(/** @type {IMap | null} */)

    /** список точек на карте */
    const [point, setPoint] = useState(/**@type{InputPoint} */ null)

    //==================================================================================================================
    useEffect(() => {
        if (errorMessage) navigate('/travel/add/map/')
    }, [errorMessage])


    // начальное значение первой точки =================================================================================
    useEffect(() => {
        if (user) setPoint({id: createId(user.id), text: '', point: undefined})
    }, [user])

    //обработка события drag-point =====================================================================================
    useEffect(() => {
        const handleDragPoint = (e) => {
            const {point: draggedPoint} = e.detail
            if (draggedPoint) {
                setPoint(prev => ({...prev, text: draggedPoint.textAddress, point: draggedPoint}) )
            }
        }

        document.addEventListener('drag-point', handleDragPoint)
        return () => document.removeEventListener('drag-point', handleDragPoint)
    }, [])

    //==================================================================================================================
    function handleKeyDown(e) {
        if (e.keyCode === 13) {
            map.clear()

            map.addMarkerByAddress(point.text, point.id)
                .then(markerInfo => {
                    if (markerInfo) {
                        /**type{InputPoint} */
                        const newPoint = {...point, text: markerInfo.textAddress, point: markerInfo}
                        setPoint(newPoint)
                    }
                })
        }
    }

    function handleChange(e) {
        setPoint({...point, text: e.target.value})
    }

    //==================================================================================================================
    /** обновляем store (добавление) */
    function handleSubmit() {
        if(travel && point) {
            /** обновление о месте в redux store */
            dispatch(actions.travelActions.addWaypoint(point))
            /** обновление информации о путешествии в бд */
            storeDB.editElement(constants.store.TRAVEL, travel)
                .then(() => navigate(`/travel/${travel.id}/add/map/`))
        } else{
            pushAlertMessage({type: 'warning', message: 'Путешествие не созданно'})
        }
    }


    return (
        <div className='wrapper'>
            <Container className='waypoint-container'>
                <PageHeader arrowBack title='Направление'/>
                <div className='column gap-0.5 pb-20'>
                    {/*<div className='link'>+ Указать точку отправления</div>*/}
                    <Input
                        id='diraction'
                        placeholder={'Куда едем?'}
                        value={point?.text || ''}
                        onKeyDown={handleKeyDown}
                        onChange={handleChange}
                        autoComplete='off'
                    />
                </div>
            </Container>
            <div className='content'>
                <YandexMapContainer travel={travel} userLocation={userLoc} onMapReady={setMap} />
            </div>
            <div className='fixed-bottom-button'>
                <Button
                    onClick={handleSubmit}
                    disabled={!map || !map.getMarkers().length}
                >
                    Продолжить
                </Button>
            </div>
        </div>
    )
}