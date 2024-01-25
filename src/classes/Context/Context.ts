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


    setUser(user: User) {
        this.user = user
        this.emit('update')
    }

    setTravel(travel: Travel) {
        this.travel = travel
        this.emit('update')
    }

    get isLogIn(){
        return !!(this.user && this.user.isLogIn());


    }

}