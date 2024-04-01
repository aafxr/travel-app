import {Link, useParams} from "react-router-dom";
import React, {useEffect, useState} from "react";

import {HotelStep} from "../../../../classes/StoreEntities/route/HotelStep";
import {PlaceStep} from "../../../../classes/StoreEntities/route/PlaceStep";
import {RoadStep} from "../../../../classes/StoreEntities/route/RoadStep";
import Container from "../../../../components/Container/Container";
import {useTravel} from "../../../../contexts/AppContextProvider";
import {Travel} from "../../../../classes/StoreEntities";
import {Tab} from "../../../../components/ui";

import Swipe from "../../../../components/ui/Swipe/Swipe";
import {PlaceStepCard} from "./steps/PlaceStepCard";
import {HotelStepCard} from "./steps/HotelStepCard";
import {RoadStepCard} from "./steps/RoadStepCard";

import './steps/ShowSteps.css'
import {TrashIcon} from "../../../../components/svg";


export default function ShowSteps() {
    const travel = useTravel()
    const {dayNumber} = useParams()
    const [actualSteps, setActualSteps] = useState<Travel['steps']>([])


    useEffect(() => {
        if (!travel) return
        if (dayNumber) {
            const day = Number(dayNumber)
            const steps = travel.steps.filter(s => s.day === day)
            const idx = travel.steps.findIndex(s => s === steps[steps.length - 1])
            if (~idx && travel.steps[idx + 1] instanceof HotelStep) {
                steps.push(travel.steps[idx + 1])
            }
            setActualSteps(steps)
        }
    }, [dayNumber])


    if (!travel) return null

    return (
        <>
            <div className='travel-tab-container flex-stretch flex-nowrap hide-scroll flex-0'>
                {Array.from({length: travel.days})
                    .map((_, i) => (
                        <Tab to={`/travel/${travel.id}/${i + 1}/`} key={i + 1} name={`${i + 1} день`}/>
                    ))
                }
            </div>
            <Container className='column overflow-x-hidden pt-20 pb-20 gap-1 flex-1'>
                {
                    actualSteps.length
                        ? actualSteps.map((p, idx) => <StepCard key={idx} step={p}/>)
                        : <Link className='link align-center gap-1' to={`/travel/${travel.id}/add/place/`}>
                            +&nbsp;Добавить локацию
                        </Link>
                }
            </Container>
        </>
    )
}


function StepCard({step}: { step: Travel["steps"][number] }) {

    if (step instanceof PlaceStep) {
        const removeElement = <div className='column'>
            <div className='icon'>
                <TrashIcon  />
            </div>
            <span>Удалить</span>
        </div>
        return (
            <Swipe
                rightElement={removeElement}
                rightButton
                rElemBg={'right-card-bg'}
            >
                <PlaceStepCard place={step}/>
            </Swipe>
        )
    } else if (step instanceof RoadStep) {
        return <RoadStepCard road={step}/>
    } else {
        return <HotelStepCard hotel={step}/>
    }
}


