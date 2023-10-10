import clsx from "clsx";

import Container from "../../../../components/Container/Container";
import InfoBlock from "../../../../components/InfoBlock/InfoBlock";
import FavoriteIcon from "../../../../components/svg/FavoriteIcon";
import AudioBtn from "../../../../components/AudioBtn/AudioBtn";
import Button from "../../../../components/ui/Button/Button";
import Comment from "../../../../components/Comment/Comment";
import {DEFAULT_IMG_URL} from "../../../../static/constants";
import Rating from "../../../../components/Rating/Rating";
import {Chip, PageHeader} from "../../../../components/ui";

import './HotelDetails.css'

/**
 * Страница отображения информации об отеле
 * @function
 * @name HotelDetails
 * @returns {JSX.Element}
 * @category Pages
 */
export default function HotelDetails() {
    const classNames = clsx('wrapper',{'selected': true})

    return (
        <div className={classNames}>
            <Container>
                <PageHeader arrowBack title={'Cosmos Sochi Hotel'}/>
            </Container>
            <Container className='content column gap-1 pb-20'>
                <div className='hotel-image relative'>
                    <img className='img-abs' src={DEFAULT_IMG_URL} alt="hotel"/>
                </div>
                <div className='flex-wrap gap-1'>
                    <Chip color='grey'>45 мин</Chip>
                    <Chip color='grey'>300р / чел</Chip>
                </div>
                <div className='hotel-price'>
                    <div className='title-bold'>{'от 32 500 Р'}</div>
                    <div className='hotel-days'>{'за 5 ночей'}</div>
                </div>

                <InfoBlock
                    title='Описание'
                    description='Ребенка 13 лет впечатлило!Для частного коллекционера довольно обширное количество техники.Большая часть коллекции под навесом.Есть несколько экскурсоводов,сопровождение которых входит в стоимость входного билета.На территории проводится дегустация чая местного производства. Там же небольшое помещение с выставкой самоваров и фотозоной.Поездкой остались довольны.'
                    lineNumber={3}
                />

                <AudioBtn />
                <InfoBlock title='Услуги' lineNumber={3}>
                    <div>Завтрак</div>
                    <div>Wi-Fi</div>
                    <div>Тренажерный зал</div>
                    <div>Кондиционер </div>
                </InfoBlock>
                <InfoBlock title='Номера' lineNumber={3}>
                    <div>2-местный, 2 кровати, Стандарт</div>
                    <div>2-местный, 1 кровать, Стандарт</div>
                    <div>Улучшенный номер, Стандарт</div>
                </InfoBlock>
                <InfoBlock title='Контакты' lineNumber={3}>
                    <div>+71234567890</div>
                    <div> site.ru</div>
                    <div> email@email.ru</div>
                </InfoBlock>
                <div className='column gap-0.5'>
                    <div className='title-bold'>Отзывы</div>
                    <div className='hotel-rating-container row gap-0.5'>
                        <Rating rating={3.6}/>
                        <span className='hotel-rating'>{'4.4'}</span>
                        <span className='hotel-revues'>{`/ ${'20'} оценок`}</span>
                    </div>
                    <Comment
                        rating={5}
                        author={'Наталья'}
                        content={'Ребенка 13 лет впечатлило!Для частного коллекционера довольно обширное количество техники.Большая часть коллекции под навесом.Есть несколько экскурсоводов,сопровождение которых входит в стоимость входного билета.На территории проводится дегустация чая местного производства. Там же небольшое помещение с выставкой самоваров и фотозоной.Поездкой остались довольны.'}
                        date={'12.07.22'}
                    />
                    <Comment
                        rating={2}
                        author={'Алексей'}
                        content={'Прекрасное место, большая выставка машин, внутри здания много самоваров и всякая старинная утварь. Можно попить чай с сушками из самовара и купить местного чая, который кстати представлен в большом ассортименте и стоит того.'}
                        date={'09.07.22'}
                    />
                    <Comment
                        rating={3.5}
                        author={'Наталья'}
                        content={'Ребенка 13 лет впечатлило!Для частного коллекционера довольно обширное количество техники.Большая часть коллекции под навесом.Есть несколько экскурсоводов,сопровождение которых входит в стоимость входного билета.На территории проводится дегустация чая местного производства. Там же небольшое помещение с выставкой самоваров и фотозоной.Поездкой остались довольны.'}
                        date={'12.07.22'}
                    />
                </div>

            </Container>
                <div className='footer-btn-container footer'>
                    <Button className='center'>Добавить в избранное&nbsp;<FavoriteIcon className='hotel-favorite' /></Button>
                </div>
        </div>
    )
}
