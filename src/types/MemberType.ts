import {MovementType} from "./MovementType";

export interface MemberType{
    id: string,
    first_name: string,
    last_name: string,
    username: string,
    photo: string,
    movementType: MovementType[]
    age:number
}