import {fetchUsers} from "../../api/fetch/fetchUsers";
import {fetchUser} from "../../api/fetch/fetchUser";
import {MemberType} from "../../types/MemberType";
import {StoreName} from "../../types/StoreName";
import {Member} from "../StoreEntities/Member";
import {DB} from "../db/DB";
import {PhotoService} from "./PhotoService";
import {Photo} from "../StoreEntities/Photo";


export class MemberService {
    static async getById(id: string) {
        let member = await fetchUser(id)
        if (member) await DB.update(StoreName.USERS, member)
        else member = await DB.getOne<MemberType>(StoreName.USERS, id)

        if (member) {
            const memberinstance = new Member(member)
            if(memberinstance.photo){
                const photo = await PhotoService.getById(memberinstance.photo)
                if(photo) memberinstance.setPhoto(new Photo(photo))
            }
            return memberinstance
        }
    }

    static async getManyByIds(ids: string[]) {
        let members_types = await fetchUsers(ids)
        if (members_types) await DB.writeAllToStore(StoreName.USERS, members_types)
        else members_types = await DB.getManyByIds<MemberType>(StoreName.USERS, ids)
        const members =  members_types.map(m => new Member(m))
        for (const member  of members){
            if(member.photo){
                const photo = await PhotoService.getById(member.photo)
                if(photo) member.setPhoto(new Photo(photo))
            }
        }
        return members

    }
}