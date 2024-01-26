import {TravelPreference} from "../types/TravelPreference";

export class Preference implements TravelPreference{
    density: 1 | 2 | 3 = 2;


    constructor(pref?: Partial<TravelPreference>) {
        if(!pref) return

        if(pref.density) this.density = pref.density
    }

    dto():TravelPreference{
        return {
            density: this.density,
        }
    }
}