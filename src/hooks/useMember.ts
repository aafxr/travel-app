import {useEffect, useState} from "react";

import defaultHandleError from "../utils/error-handlers/defaultHandleError";
import {MemberService} from "../classes/services/MemberService";
import {Member} from "../classes/StoreEntities/Member";

type MemberHookStateType = {
    member: Member | undefined
    loading: boolean
}

export function useMember(id: string | undefined) {
    const [state, setState] = useState<MemberHookStateType>({member: undefined, loading: true})

    useEffect(() => {
        if (state.member && state.member.id === id) return

        if (id) {
            MemberService.getById(id)
                .then(m => setState({loading: false, member: m}))
                .catch(defaultHandleError)
        }
    }, [id])

    return state
}