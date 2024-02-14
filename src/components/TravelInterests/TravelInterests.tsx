import {Preference} from "../../classes/Preference";
import {Chip} from "../ui";

type KeyType = keyof Preference['interests']

type TravelInterestsType = {
    interests: Preference['interests']
    onClick?: (key: keyof Preference['interests']) => unknown
}

const translate = new Map<keyof Preference['interests'], string>([
    ["active", "Активный отдых"],
    ["history", "История"],
    ["nature", "Природа"],
    ["party", "Клубы"],
    ["child", "Дети"],
])

export default function TravelInterests({interests, onClick}: TravelInterestsType) {
    return (
        <div className='flex-wrap gap-0.5'>
            {Object.entries(interests).map(([k, v]) =>
                translate.has(k as KeyType)
                    ? <Chip
                        key={k}
                        rounded
                        color={v ? "orange" : "grey"}
                        onClick={() => onClick && onClick(k as KeyType)}
                    >{translate.get(k as KeyType)}</Chip>
                    : null
            )}
        </div>
    )
}