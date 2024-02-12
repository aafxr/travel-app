import React from 'react';

import TitleAndMore from "../TitleAndMore/TitleAndMore";
import {APIRouteType} from "../../api/fetch/fetchRouteAdvice";

import './RecommendSection.css'

type RecommendSectionPropsType = {
    routes: APIRouteType[]
}

const formatter = Intl.NumberFormat(navigator.language, {maximumFractionDigits: 2, minimumFractionDigits: 2})

function RecommendSection({routes}: RecommendSectionPropsType) {
    if (!routes.length)
        return null

    return (
        <section className='recommend'>
            <TitleAndMore title='Возможно, вам понравится' to='/'/>
            <ul className='recommend-cards-list'>
                {
                    routes.map(r => (
                        <div className='route column gap-0.25'>
                            <div>Подходит на {r.score}%</div>
                            <div>Дорога {formatter.format(r.road.distance)}&nbsp;км</div>
                            <div>Время в дороге {r.road.time}&nbsp;мин</div>
                            <div>Бюджет ~{formatter.format(r.price)}</div>
                        </div>
                    ))
                }


                {/*<li><SmallCard subtitle={'Сочи'} title={'Сочи за 4 дня'}/></li>*/}
                {/*<li><SmallCard subtitle={'Сочи'} title={'Сочи за 4 дня'}/></li>*/}
                {/*<li><SmallCard subtitle={'Сочи'} title={'Сочи за 4 дня'}/></li>*/}
                {/*<li><SmallCard subtitle={'Сочи'} title={'Сочи за 4 дня'}/></li>*/}
            </ul>

        </section>
    );
}

export default RecommendSection;