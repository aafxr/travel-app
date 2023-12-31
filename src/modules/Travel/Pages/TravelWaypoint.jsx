import React from "react";
import {Link} from "react-router-dom";

import Container from "../../../components/Container/Container";
import Button from "../../../components/ui/Button/Button";
import { PageHeader} from "../../../components/ui";

import '../css/Travel.css'

/**
 * @function
 * @name TravelWaypoint
 * @returns {JSX.Element}
 * @category Pages
 */
export default function TravelWaypoint() {
    // const [destination, setDestination] = useState('')


    return (
        <>
            <div className='travel wrapper'>
                <Container className='content'>
                    <PageHeader arrowBack title='Направление' />
                    <Container className='column'>
                        <Link className='travel-link' to={'*'}>
                            <div className='icon'>
                                <img className={'img-abs'} src={process.env.PUBLIC_URL + '/icons/map.svg'} alt="map"/>
                            </div>
                            Указать на карте
                        </Link>
                        <Link className='travel-link' to={'*'}>
                            <div className='icon'>
                                <img className={'img-abs'} src={process.env.PUBLIC_URL + '/icons/navigation.svg'} alt="navigation"/>
                            </div>
                            Текущее местоположение
                        </Link>
                        <Link className='travel-link' to={'*'}>
                            Москва
                        </Link>
                        <Link className='travel-link' to={'*'}>
                            Санкт-Петербург
                        </Link>
                    </Container>

                </Container>
                <div className='footer footer-btn-container'>
                    <Button>Продолжить</Button>
                </div>
            </div>
        </>
    )
}