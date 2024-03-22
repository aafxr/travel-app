import {Travel, User} from "../StoreEntities";
import EventEmitter from "../EventEmmiter";
import {Socket} from "socket.io-client";

export class Context extends EventEmitter {
    user: User | null = null
    travel: Travel | null = null
    socket: Socket | null = null

    constructor(context?: Context) {
        super();
        if(!context) return

        if(context.user) this.user = context.user
        if(context.travel) this.travel = context.travel
        if(context.socket) this.socket = context.socket
    }


    setUser(user: User | null) {
        this.user = user
        this.emit('update', [this])
    }

    setTravel(travel: Travel | null) {
        this.travel = travel
        this.emit('update', [this])
    }

    setSocket(socket: Socket | null){
        this.socket = socket
        this.emit('update', [this])
    }

    get isLogIn(){
        return !!(this.user && User.isLogIn(this.user));


    }

}