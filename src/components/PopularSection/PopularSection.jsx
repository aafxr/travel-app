import React from 'react';
import clsx from "clsx";

import TitleAndMore from "../TitleAndMore/TitleAndMore";
import SmallCard from "../SmallCard/SmallCard";

import './PopularSection.css'


/**
 * @function
 * @name PopularSection
 * @param {React.HTMLAttributes<HTMLSelectElement>} props
 * @return {JSX.Element}
 */
function PopularSection(props) {
    return (
        <section className={clsx('popular', props.className)}>
            <TitleAndMore title='Популярные маршруты' to='/' />
            <ul className='popular-card-list gap-1'>
                <li className='flex-0'><SmallCard  subtitle={'Сочи'} title={'Сочи за 4 дня'} style={{width: '240px'}}/></li>
                <li className='flex-0'><SmallCard  subtitle={'Сочи'} title={'Сочи за 4 дня'} style={{width: '240px'}}/></li>
                <li className='flex-0'><SmallCard  subtitle={'Сочи'} title={'Сочи за 4 дня'} style={{width: '240px'}}/></li>
                <li className='flex-0'><SmallCard  subtitle={'Сочи'} title={'Сочи за 4 дня'} style={{width: '240px'}}/></li>
            </ul>
        </section>
    );
}

export default PopularSection;