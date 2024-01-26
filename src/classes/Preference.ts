import {TravelPreference} from "../types/TravelPreference";

export class Preference implements TravelPreference{
    density: 1 | 2 | 3 = 2;
    depth: 1 | 2 | 3 = 2;


    constructor(pref?: Partial<TravelPreference>) {
        if(!pref) return

        if(pref.density) this.density = pref.density
        if(pref.depth) this.depth = pref.depth
    }

    dto():TravelPreference{
        return {
            density: this.density,
            depth: this.depth,
        }
    }

}