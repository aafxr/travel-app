import React, {useState} from "react";
import {Link, useLocation, useNavigate} from "react-router-dom";

import Container from "../../Expenses/components/Container/Container";
import Button from "../../Expenses/components/Button/Button";
import {Input, PageHeader} from "../../../components/ui";

import '../css/Travel.css'


export default function TravelAdd() {
    const [destination, setDestination] = useState('')
    const navigate = useNavigate()
    const {pathname} = useLocation()


    function handler(){
        navigate(pathname + '1/')
    }


    return (
        <>
            <div className='travel wrapper'>
                <div className='content'>
            <PageHeader arrowBack className='travel-destination'>
                <Input
                    className='travel-destination-input'
                    value={destination}
                    onChange={e => setDestination(e.target.value)}
                    placeholder='Куда едем?'
                />
            </PageHeader>

                    <Container className='column'>
                        <div className='column gap'>
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
                        </div>
                    </Container>

                </div>
                <div className='footer'>
                    <Button onClick={handler} disabled={!destination}>Продолжить</Button>
                </div>
            </div>
        </>
    )
}