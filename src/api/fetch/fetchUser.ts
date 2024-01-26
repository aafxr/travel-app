import aFetch from "../../axios";
import {MemberType} from "../../types/MemberType";

export  async function  fetchUser(id: string){
    try{
        const user: MemberType | undefined = (await aFetch.post('/users/', {data: id})).data
        return user
    }catch (e){
    }
}