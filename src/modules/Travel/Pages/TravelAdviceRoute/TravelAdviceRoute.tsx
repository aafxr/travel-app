import clsx from "clsx";
import {useNavigate} from "react-router-dom";
import React, {useEffect, useState} from "react";

import defaultHandleError from "../../../../utils/error-handlers/defaultHandleError";
import {useAppContext, useTravel, useUser} from "../../../../contexts/AppContextProvider";
import {Route} from "../../../../classes/StoreEntities/route/Route";
import Container from "../../../../components/Container/Container";
import Button from "../../../../components/ui/Button/Button";
import {TravelService} from "../../../../classes/services";
import {Travel} from "../../../../classes/StoreEntities";
import {PageHeader} from "../../../../components/ui";

import './TravelAdviceRoute.css'

const formatter = Intl.NumberFormat(navigator.language, {maximumFractionDigits: 2, minimumFractionDigits: 2})

export default function TravelAdviceRoute() {
    const navigate = useNavigate()

    const user = useUser()
    const travel = useTravel()
    const context = useAppContext()

    const [recommend, setRecommend] = useState<Route[]>([])
    const [selected, setSelected] = useState<Route>()
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (!travel) return

        setLoading(true)
        TravelService.getRecommendRoutes(travel)
            .then(setRecommend)
            .catch(defaultHandleError)
            .finally(() => setLoading(false))
    }, [])

    function handleSelectRoute(r: Route) {
        if (r === selected) setSelected(undefined)
        else setSelected(r)
    }

    function handleNext() {
        if(!travel) return
        if(selected && user) {
            Travel.setRoute(travel, selected)
            TravelService.update(context, travel, user)
                .then(() => navigate(`/travel/${travel.id}/`))
                .catch(defaultHandleError)
        } else{
            navigate(`/travel/${travel.id}/`)
        }
    }

    return (
        <div className='wrapper'>
            <Container>
                <PageHeader title={'Возможно вам понравится'}/>
            </Container>
            <Container className='content column gap-1' loading={loading}>
                {recommend.map((r, i) => (
                    <div
                        key={i}
                        className={clsx('route column gap-0.25', {'selected': r === selected})}
                        onClick={() => handleSelectRoute(r)}
                    >
                        <div>Подходит на {r.score.toFixed(1)}%</div>
                        <div>Дорога {formatter.format(r.road.distance)}&nbsp;км</div>
                        <div>Время в дороге {r.road.time}&nbsp;мин</div>
                        <div>Бюджет ~{formatter.format(r.price)}&nbsp;{user?.currency}</div>
                    </div>
                ))}
            </Container>
            <div className='footer-btn-container'>
                <Button onClick={handleNext}>Продолжить</Button>
            </div>
        </div>
    )
}