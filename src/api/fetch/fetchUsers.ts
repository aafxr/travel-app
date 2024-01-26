import aFetch from "../../axios";
import {MemberType} from "../../types/MemberType";

export  async function  fetchUsers(ids: string[]){
    if (!ids.length) return []
    try{
        const users: MemberType[] | undefined = (await aFetch.post('/users/', {data: ids})).data
        if( users && users.length) return users
        else return []
    }catch (e){
        return []
    }
}