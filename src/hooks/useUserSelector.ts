import {useContext} from "react";
import {UserContext} from "../contexts/UserContextProvider";

/**
 * хук достает из стейта данные юзера
 */
export default function useUserSelector(){
    const {user} = useContext(UserContext)
    return user
}