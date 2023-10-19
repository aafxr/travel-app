import {useSelector} from "react-redux";
import constants from "../static/constants";

/**
 * хук достает из стейта данные юзера
 * @name useUserSelector
 * @returns {UserState}
 * @category Hooks
 */
export default function useUserSelector(){
    return useSelector(state => state[constants.redux.USER])
}