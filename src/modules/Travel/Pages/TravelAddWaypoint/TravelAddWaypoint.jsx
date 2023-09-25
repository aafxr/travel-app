import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import {useEffect, useRef, useState} from "react";

import MapControls from "../../../../components/MapControls/MapControls";
import {pushAlertMessage} from "../../../../components/Alerts/Alerts";
import Container from "../../../../components/Container/Container";
import Button from "../../../../components/ui/Button/Button";
import {Input, PageHeader} from "../../../../components/ui";
import constants from "../../../../static/constants";
import YandexMap from "../../../../api/YandexMap";
import createId from "../../../../utils/createId";
import {actions} from "../../../../redux/store";

import './TravelAddWaypoint.css'

export default function TravelAddWaypoint() {
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const {user, userLoc} = useSelector(state => state[constants.redux.USER])
    const {travel} = useSelector(state => state[constants.redux.TRAVEL])

    /** референс на контайнер карты */
    const mapRef = useRef(/**@type{HTMLDivElement}*/ null)

    /** интерфейс для взаимодействия с картой */
    const [map, setMap] = useState(/**@type{IMap} */ null)

    /** список точек на карте */
    const [point, setPoint] = useState(/**@type{InputPoint} */ null)

    //==================================================================================================================
    useEffect(() => {
        if (!travel) navigate('/travel/add/map/')
    }, [travel])


    // начальное значение первой точки =================================================================================
    useEffect(() => {
        if (user) setPoint({id: createId(user.id), text: '', point: undefined})
    }, [user])

    // инициализация карты =============================================================================================
    useEffect(() => {
        if (mapRef.current && !map) {
            YandexMap.init({
                api_key: process.env.REACT_APP_API_KEY,
                mapContainerID: 'map',
                location: userLoc,
                points: [],
                markerClassName: 'location-marker'
            }).then(newMap => {
                window.map = newMap
                setMap(newMap)
            }).catch(console.error)
        }

        return () => map && map.destroyMap()
    }, [mapRef, map])

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

            map.addMarkerByAddress(point.text)
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
            dispatch(actions.travelActions.addWaypoint(point))
            navigate('/travel/add/map/')
        } else{
            pushAlertMessage({type: 'warning', message: 'Путешествие не созданно'})
        }
    }


    return (
        <div className='wrapper'>
            <Container className='waypoint-container'>
                <PageHeader arrowBack title='Направление'/>
                <div className='column gap-0.5 pb-20'>
                    <div className='link'>+ Указать точку отправления</div>
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
                <div
                    ref={mapRef}
                    id='map'
                    className='relative'
                >
                    <MapControls className='map-controls' map={map}/>
                </div>
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