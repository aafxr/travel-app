import aFetch from "../../axios";
import {MemberType} from "../../types/MemberType";

export  async function  fetchUsers(ids: string[]){
    if (!ids.length) return []
    try{
        const response: {ok:boolean, data:MemberType[]} | undefined = (await aFetch.post('/user/getList/', {data: ids})).data
        if( response && response.ok) return response.data
        else return []
    }catch (e){
        return []
    }
}