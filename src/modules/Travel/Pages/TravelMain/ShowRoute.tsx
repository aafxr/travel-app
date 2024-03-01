import React, {createContext, useEffect, useMemo, useState} from "react";

import {useTravel, useUser} from "../../../../contexts/AppContextProvider";
import {CalendarIcon, FlagIcon, MapIcon} from "../../../../components/svg";
import {Place, Road, User} from "../../../../classes/StoreEntities";
import Container from "../../../../components/Container/Container";
import {RouteFilterType} from "../../../../types/filtersTypes";
import Button from "../../../../components/ui/Button/Button";
import {MS_IN_DAY} from "../../../../static/constants";
import ShowRouteOnMap from "./ShowRouteOnMap";
import ShowPlaces from "./ShowPlaces";

import './TravelMain.css'
import ShowSteps from "./ShowSteps";

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
    const user = useUser()
    const travel = useTravel()
    const [filterType, setFilterType] = useState<RouteFilterType>('byDays')


    useEffect(() => {
        if (!user) return
        setFilterType(user.settings.routeFilter)
    }, [user])


    const newGroupState: DayGroupContextType = useMemo(() => {
        if (!travel) return {dayGroups: new Map()}

        const newGroupState: DayGroupContextType = {dayGroups: new Map()}
        const itemsList = [...travel.places, ...travel.road]
            .sort((a, b) => a.time_start.getTime() - b.time_start.getTime())
        const items = new Set(itemsList)
        const t = new Date(0)
        let d_start = t.getTime()
        let d_end = d_start + MS_IN_DAY
        for (let i = 0; i < travel.days; i++) {
            const group: DayGroupType = {items: [], color: colors[i % colors.length]}

            // eslint-disable-next-line no-loop-func
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

    function handleFilterSelect(type: RouteFilterType) {
        if (!user) return;
        User.setRouteFilter(user, type)
        setFilterType(type)
    }

    if (!user) return null


    return (
        <div className='h-full relative column'>
            <Container className='flex-0'>
                <div className='flex-between gap-1 pt-20 pb-20'>
                    <Button
                        className='travel-details-button'
                        onClick={() => handleFilterSelect('byDays')}
                        active={User.getSetting(user, 'routeFilter') === 'byDays'}
                    >
                        <div className='column center'>
                            <CalendarIcon className='icon'/>
                            <span>по дням</span>
                        </div>
                    </Button>
                    <Button
                        className='travel-details-button'
                        onClick={() => handleFilterSelect('onMap')}
                        active={User.getSetting(user, 'routeFilter') === 'onMap'}
                    >
                        <div className='column center'>
                            <MapIcon className='icon'/>
                            <span>на карте</span>
                        </div>
                    </Button>
                    <Button
                        className='travel-details-button'
                        onClick={() => handleFilterSelect('allPlaces')}
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
                    // User.getSetting(user, 'routeFilter') === 'byDays' && <ShowRouteByDays/>
                    User.getSetting(user, 'routeFilter') === 'byDays' && <ShowSteps/>
                }
            </DaysGroupContext.Provider>
        </div>
    )
}