import React from 'react';


import './RecommendSection.css'
import TitleAndMore from "../TitleAndMore/TitleAndMore";
import SmallCard from "../SmallCard/SmallCard";

function RecommendSection(props) {
    return (
        <section className='recommend'>
            <TitleAndMore title='Возможно, вам понравится' to='/'/>
            <ul className='recommend-cards-list'>
                <li><SmallCard subtitle={'Сочи'} title={'Сочи за 4 дня'}/></li>
                <li><SmallCard subtitle={'Сочи'} title={'Сочи за 4 дня'}/></li>
                <li><SmallCard subtitle={'Сочи'} title={'Сочи за 4 дня'}/></li>
                <li><SmallCard subtitle={'Сочи'} title={'Сочи за 4 дня'}/></li>
            </ul>

        </section>
    );
}

export default RecommendSection;