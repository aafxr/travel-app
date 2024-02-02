import {useContext} from "react";
import {DayGroupType, DaysGroupContext} from "./ShowRoute";

export function useGroupAtDay(day: string | undefined): DayGroupType {
    return useContext(DaysGroupContext).dayGroups.get(day || '') || {items: [], color: '#000000'}
}