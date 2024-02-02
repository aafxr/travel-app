import {AirplaneIcon, BusIcon, CarIcon, WalkIcon} from "./svg";
import {MovementType} from "../types/MovementType";


export const defaultMovementTags = [
    {id: MovementType.WALK, icon: WalkIcon ({className: 'img-abs'}), title: 'пешком'},
    {id: MovementType.CAR, icon: CarIcon ({className: 'img-abs'}), title: 'авто'},
    {id: MovementType.PUBLIC_TRANSPORT, icon: BusIcon ({className: 'img-abs'}), title: 'общественный транспорт'},
    {id: MovementType.FLIGHT, icon: AirplaneIcon ({className: 'img-abs'}), title: 'Самолет'},
]