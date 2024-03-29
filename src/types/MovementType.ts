/**
 * @category Types
 * @name MovementType
 * @typedef {object} MovementType
 * @property {string} id
 * @property {string} title
 * @property {JSX.Element} [icon]
 */

export enum MovementType{
    WALK,
    CAR,
    PUBLIC_TRANSPORT,
    FLIGHT,
    TAXI
}