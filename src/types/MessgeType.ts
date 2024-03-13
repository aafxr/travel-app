import {Action} from "../classes/StoreEntities";

export type MessgeType = {
    join?: { travelID:string }

    leave?: { travelID: string }

    message?: {
        travelID:string
        from: string
        text: string
        photo?: string | string[]
    }
    
    action?: {
        receivers: string[]
        action: Action<any>
    }
    
}