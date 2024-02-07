import {Travel, User} from "../StoreEntities";
import EventEmitter from "../EventEmmiter";

export class Context extends EventEmitter {
    user: User | null = null
    travel: Travel | null = null

    constructor(context?: Context) {
        super();
        if(!context) return

        if(context.user) this.user = context.user
        if(context.travel) this.travel = context.travel

    }


    setUser(user: User | null) {
        this.user = user
        this.emit('update', [this])
    }

    setTravel(travel: Travel | null) {
        this.travel = travel
        this.emit('update', [this])
    }

    get isLogIn(){
        return !!(this.user && User.isLogIn( this.user));


    }

}