import {DBFlagType} from "../types/DBFlagType";

type InterestsType = {
    history?: DBFlagType
    nature?: DBFlagType
    party?: DBFlagType
    active?: DBFlagType
    child?: DBFlagType
}

export class Preference {
    static base_density = 2
    static base_depth = 2
    static base_duration = 45 * 60 * 1000
    density: 1 | 2 | 3 = 2;
    depth: 1 | 2 | 3 = 2;
    interests: InterestsType = {
        history: 0,
        nature: 0,
        party: 0,
        active: 0,
        child: 0,
    }


    constructor(pref?: Partial<Preference>) {
        if (!pref) return

        if (pref.density) this.density = pref.density
        if (pref.depth) this.depth = pref.depth
        if (pref.interests) Object.assign(this.interests, pref.interests)
    }
}