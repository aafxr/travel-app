import {useUser} from "../contexts/AppContextProvider";

/**
 * хук достает из стейта данные юзера
 */
export default function useUserSelector(){
    return useUser()
    // const {user} = useContext(UserContext)
    // return user
}