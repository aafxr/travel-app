import {TravelPreferences} from "../types/TravelPreferences";
import {DBFlagType} from "../types/DBFlagType";

export class Preferences implements TravelPreferences{
    public: DBFlagType = 0
    showCheckList: DBFlagType = 0
    showComments: DBFlagType = 0
    showExpenses: DBFlagType = 0
    showRoute: DBFlagType = 0
    density: 1 | 2 | 3 = 2;


    constructor(pref: Partial<TravelPreferences>) {
        if(pref.public !== undefined) this.public = pref.public
        if(pref.showCheckList !== undefined) this.showCheckList = pref.showCheckList
        if(pref.showComments !== undefined) this.showComments = pref.showComments
        if(pref.showExpenses !== undefined) this.showExpenses = pref.showExpenses
        if(pref.showRoute !== undefined) this.showRoute = pref.showRoute
        if(pref.density) this.density = pref.density
    }

    dto():TravelPreferences{
        return {
            public: this.public,
            showCheckList: this.showCheckList,
            showComments: this.showComments,
            showExpenses: this.showExpenses,
            showRoute: this.showRoute,
            density: this.density,
        }
    }

}