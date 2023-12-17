import {useNavigate, useParams} from "react-router-dom";
import {useContext, useEffect, useState} from "react";

import YandexMapContainer from "../../../../components/YandexMapContainer/YandexMapContainer";
import {pushAlertMessage} from "../../../../components/Alerts/Alerts";
import {UserContext} from "../../../../contexts/UserContextProvider";
import Container from "../../../../components/Container/Container";
import useTravelContext from "../../../../hooks/useTravelContext";
import Button from "../../../../components/ui/Button/Button";
import {Input, PageHeader} from "../../../../components/ui";
import useDragPoint from "../../hooks/useDragPoint";

import './TravelAddWaypoint.css'

/**
 * @function
 * @name TravelAddWaypoint
 * @returns {JSX.Element}
 * @category Pages
 */
export default function TravelAddWaypoint() {
    const {pointCode} = useParams()
    const navigate = useNavigate()
    // const dispatch = useDispatch()

    const {user, userLoc} = useContext(UserContext)
    const {travel, travelObj} = useTravelContext()

    /** интерфейс для взаимодействия с картой */
    const [map, setMap] = useState(/** @type {IMap | null} */null)

    /** список точек на карте */
    const [point, setPoint] = useState(/**@type{PointType} */ null)

    const dragPoint = useDragPoint()

    //==================================================================================================================
    // useEffect(() => {
    //     if (errorMessage) navigate('/travel/add/map/')
    // }, [errorMessage])


    // начальное значение первой точки =================================================================================
    useEffect(() => {
        if (pointCode && travel && map) {
            const p = travelObj.waypoints.find(p => p.id === pointCode)
            setPoint(p ? p : map.newPoint(travelObj.id))
        }
    }, [pointCode, travel, map])

    //обработка изменения положения точки после взаимодейсвия ==========================================================
    useEffect(() => {
        if (dragPoint)
            setPoint({...point, address: dragPoint.dragPoint.address})
    }, [dragPoint])

    //==================================================================================================================
    function handleKeyDown(e) {
        if (e.keyCode === 13) {
            handleFindLocation()
        }
    }

    function handleBlur(){
        handleFindLocation()
    }

    function handleFindLocation(){
        map.getPointByAddress(point.address)
            .then(/**@param {GeoObjectPropertiesType[]} markerInfo*/markerInfo => {
                if (markerInfo) {
                    const {text: address,boundedBy : coords } = markerInfo[0]
                    const kind = markerInfo[0].metaDataProperty.GeocoderMetaData.kind
                    const newPoint = {...point, address, coords: coords[0], kind }

                    travel.addWaypoint(newPoint)
                    map
                        .clearMap()
                        .addPoint(newPoint,{markerType: "exist"})
                        .showPoint(newPoint.coords)

                    setPoint(newPoint)
                }
            })
    }

    function handleChange(e) {
        setPoint({...point, address: e.target.value})
    }

    //==================================================================================================================
    /** обновляем store (добавление) */
    function handleSave() {
        if (point.address.length) {
            /** обновление информации о путешествии в бд */
            travel
                .addWaypoint(point)
                .save(user.id)
                .then(() => navigate(`/travel/${travelObj.id}/map/`))
        } else {
            travel.removeWaypoint(point)
            pushAlertMessage({type: 'warning', message: 'Путешествие не созданно'})
        }
    }

    function handleBackClick(){
        const newWaypoints = travelObj.waypoints.filter(wp => wp.id !== pointCode)
        travel.setWaypoints(newWaypoints)
        navigate(`/travel/${travelObj.id}/map/`)
    }


    return (
        <div className='wrapper'>
            <Container className='waypoint-container'>
                <PageHeader arrowBack to={handleBackClick} title='Направление'/>
                <div className='column gap-0.5 pb-20'>
                    {/*<div className='link'>+ Указать точку отправления</div>*/}
                    <Input
                        id='direction'
                        placeholder={'Куда едем?'}
                        value={point?.address || ''}
                        onKeyDown={handleKeyDown}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        autoComplete='off'
                    />
                </div>
            </Container>
            <div className='content'>
                <YandexMapContainer travel={travel} userLocation={userLoc} onMapReadyCB={setMap}/>
            </div>
            <div className='fixed-bottom-button'>
                <Button
                    onClick={handleSave}
                    disabled={!map || !map.getMarkers().length}
                >
                    Продолжить
                </Button>
            </div>
        </div>
    )
}