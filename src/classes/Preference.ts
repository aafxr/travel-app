import {TravelPreference} from "../types/TravelPreference";

export class Preference implements TravelPreference{
    static base_density = 2
    static base_depth = 2
    static base_duration = 45 * 60 * 1000
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