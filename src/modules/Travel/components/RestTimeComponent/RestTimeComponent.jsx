import {Link} from "react-router-dom";

import PhotoCarousel from "../../../../components/PhotoCarousel/PhotoCarousel";
import useTravelContext from "../../../../hooks/useTravelContext";
import {DEFAULT_IMG_URL} from "../../../../static/constants";
import {Chip} from "../../../../components/ui";

import './RestTimeComponent.css'

/**
 * @function
 * @name RestTimeComponent
 * @param children
 * @param {Activity} activity
 * @category Component
 */
export default function RestTimeComponent({children, activity}) {
    const {travel} = useTravelContext()
    const start = activity.start.toLocaleDateString() + ' ' + activity.start.toLocaleTimeString().slice(0, -3)
    const end = activity.end.toLocaleDateString() + ' ' + activity.end.toLocaleTimeString().slice(0, -3)

    const params = new URLSearchParams()
    params.set('start', activity.start.getTime())
    params.set('end', activity.end.getTime().toString())

    return (
        <Link to={`/travel/${travel.id}/add/hotel/?${params.toString()}`}>
            <div className='rest-container relative'>
                {/*<Chip className='rest-date-start'> {start} </Chip>*/}
                {/*<Chip className='rest-date-end'> {end} </Chip>*/}
                <div className='rest-img'>
                    <div className="collumn h-full">
                        <div className="row center title-semi-bold flex-0">
                            <span>{start}</span>
                            &nbsp;|&nbsp;
                            <span>{end}</span>
                        </div>
                        <div className="flex-1">
                            <div className='rest-title'>Добавить отель</div>
                        </div>
                    </div>
                    {/*<PhotoCarousel urls={[DEFAULT_IMG_URL]} className='img-abs'/>*/}
                    {/*<div className='rest-buttons'>*/}
                    {/*    {*/}
                    {/*        !!onPhotoAdd && <button*/}
                    {/*            className='rounded-button rest-btn'*/}
                    {/*            onClick={() => onPhotoAdd(rest)}*/}
                    {/*        >*/}
                    {/*            <PhotoIcon/></button>*/}
                    {/*    }*/}
                    {/*    {*/}
                    {/*        !!onEdite && <button*/}
                    {/*            className='rounded-button rest-btn'*/}
                    {/*            onClick={() => onEdite(rest)}*/}
                    {/*        >*/}
                    {/*            <EditePencil/></button>*/}
                    {/*    }*/}
                    {/*</div>*/}
                </div>
                {children}
                {/*{*/}
                {/*    !!onAdd && (*/}
                {/*        <IconButton*/}
                {/*            className='location-add-button'*/}
                {/*            iconClass='location-add-button-icon'*/}
                {/*            icon={selected ? <CheckIcon/> : <PlusIcon/>}*/}
                {/*            border={true}*/}
                {/*            shadow={false}*/}
                {/*            onClick={() => onAdd && onAdd(item)}*/}
                {/*            small*/}
                {/*        />*/}
                {/*    )*/}
                {/*}*/}
            </div>
        </Link>
    )
}