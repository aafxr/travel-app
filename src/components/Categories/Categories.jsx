import React from 'react';
import CloseFrame from "../CloseFrame/CloseFrame";
import CategoryFrame from "../CategoryFrame/CategoryFrame";
import {AirplaneIcon, BuildingIcon, CoffeeIcon, MuseumIcon, SkiIcon} from "../svg";


/**
 * @param {React.HTMLAttributes<HTMLDivElement>} props
 * @return {JSX.Element}
 * @constructor
 */
function Categories(props) {
    return (
        <div {...props} className='flex-nowrap align-center gap-0.5'>
            <CloseFrame/>
            <CategoryFrame icon={<BuildingIcon/>} text='отели'/>
            <CategoryFrame icon={<CoffeeIcon/>} text='кафе'/>
            <CategoryFrame icon={<MuseumIcon/>} text='музеи'/>
            <CategoryFrame icon={<AirplaneIcon/>} text='полет'/>
            <CategoryFrame icon={<SkiIcon/>} text='спорт'/>
        </div>
    );
}

export default Categories;