import React, {createContext, useEffect, useMemo} from "react";

import {useAppContext, useTravel, useUser} from "../../../../contexts/AppContextProvider";
import {CalendarIcon, FlagIcon, MapIcon} from "../../../../components/svg";
import Container from "../../../../components/Container/Container";
import {Place, Road, User} from "../../../../classes/StoreEntities";
import Button from "../../../../components/ui/Button/Button";
import {MS_IN_DAY} from "../../../../static/constants";
import ShowRouteByDays from "./ShowRouteByDays";
import ShowRouteOnMap from "./ShowRouteOnMap";
import debounce from "lodash.debounce";
import ShowPlaces from "./ShowPlaces";

import './TravelMain.css'

export type DayGroupType = {
    items: Array<Place | Road>
    color: string
}

type DayGroupContextType = { dayGroups: Map<string, DayGroupType> }

export const DaysGroupContext = createContext<DayGroupContextType>({dayGroups: new Map()})





const colors = [
    '#7bece7',
    '#5f72dc',
    '#bb3cbb',
    '#a53170',
    '#782135'
]


export function ShowRoute() {
    const user = useUser()!
    const travel = useTravel()

    const newGroupState: DayGroupContextType = useMemo(() => {
        if (!travel) return {dayGroups: new Map()}

        const newGroupState: DayGroupContextType = {dayGroups: new Map()}
        const itemsList = [...travel.places, ...travel.road]
            .sort((a, b) => a.time_start.getTime() - b.time_start.getTime())
        const items = new Set(itemsList)
        const t = new Date(0)
        t.setHours(0, 0, 0, 0)
        let d_start = t.getTime()
        let d_end = d_start + MS_IN_DAY
        for (let i = 0; i < travel.days; i++) {
            const group: DayGroupType = {items: [], color: colors[i % colors.length]}

            Array.from(items.values()).forEach(item => {
                if (item.time_start.getTime() >= d_start && item.time_start.getTime() <= d_end) {
                    group.items.push(item)
                    items.delete(item)
                }
                newGroupState.dayGroups.set(`${i + 1}`, group)
            })
            d_start += MS_IN_DAY
            d_end += MS_IN_DAY
        }

        if (items.size > 0) {
            const rest = [...items.values()]
            console.log(rest)
            newGroupState.dayGroups.set('-1', {items: rest, color: '#ff0000'})
        }

        return newGroupState
    }, [travel])


    return (
        <div className='h-full relative column'>
            <Container className='flex-0'>
                <div className='flex-between gap-1 pt-20 pb-20'>
                    <Button
                        className='travel-details-button'
                        onClick={() => User.setRouteFilter(user, 'byDays')}
                        active={User.getSetting(user, 'routeFilter') === 'byDays'}
                    >
                        <div className='column center'>
                            <CalendarIcon className='icon'/>
                            <span>по дням</span>
                        </div>
                    </Button>
                    <Button
                        className='travel-details-button'
                        onClick={() => User.setRouteFilter(user, 'onMap')}
                        active={User.getSetting(user, 'routeFilter') === 'onMap'}
                    >
                        <div className='column center'>
                            <MapIcon className='icon'/>
                            <span>на карте</span>
                        </div>
                    </Button>
                    <Button
                        className='travel-details-button'
                        onClick={() => User.setRouteFilter(user, 'allPlaces')}
                        active={User.getSetting(user, 'routeFilter') === 'allPlaces'}
                    >
                        <div className='column center'>
                            <FlagIcon className='icon'/>
                            <span>все места</span>
                        </div>
                    </Button>
                </div>
            </Container>
            <DaysGroupContext.Provider value={newGroupState}>
                {
                    User.getSetting(user, 'routeFilter') === 'allPlaces' && <ShowPlaces/>
                }
                {
                    User.getSetting(user, 'routeFilter') === 'onMap' && <ShowRouteOnMap/>
                }
                {
                    User.getSetting(user, 'routeFilter') === 'byDays' && <ShowRouteByDays/>
                }
            </DaysGroupContext.Provider>
        </div>
    )
}