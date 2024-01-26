import {TravelPermission} from "../types/TravelPermission";
import {DBFlagType} from "../types/DBFlagType";

type PermissionsPropsType = Partial<TravelPermission > | Permission

export class Permission implements TravelPermission{
    public: DBFlagType = 0;
    showCheckList: DBFlagType = 0;
    showComments: DBFlagType = 0;
    showExpenses: DBFlagType = 0;
    showRoute: DBFlagType = 0;

    constructor(permissions?: PermissionsPropsType) {
        if(!permissions) return

        if(permissions.public) this.public = permissions.public
        if(permissions.showCheckList) this.showCheckList = permissions.showCheckList
        if(permissions.showComments) this.showComments = permissions.showComments
        if(permissions.showExpenses) this.showExpenses = permissions.showExpenses
        if(permissions.showRoute) this.showRoute = permissions.showRoute
    }

    dto():TravelPermission{
        return {
            public: this.public,
            showCheckList: this.showCheckList,
            showComments: this.showComments,
            showExpenses: this.showExpenses,
            showRoute: this.showRoute,
        }
    }
}