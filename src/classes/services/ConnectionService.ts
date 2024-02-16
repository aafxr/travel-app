import {User} from "../StoreEntities";
import {UserError} from "../errors";
import axios from "axios";

export class ConnectionService {

    static async refresh(user: User) {
        if (!user) throw UserError.unauthorized()

        const {data: {ok, data}} = await axios.post<{ ok: boolean, data: User }>(
            process.env.REACT_APP_SERVER_URL + '/user/auth/refresh/',
            {refresh_token: user.refresh_token},
            {headers: {'Authorization': `Bearer ${user.refresh_token}`}
            })

        if (ok) return new User(data)
    }
}