import React, {useEffect} from 'react'
import {useNavigate} from "react-router-dom";

import Container from "../../components/Container/Container";
import {PageHeader} from "../../components/ui";

import './dev.css'



export default function Dev() {
    const navigate = useNavigate()


    useEffect(() => {
        if (process.env.NODE_ENV === 'production') {
            navigate('/')
        }
    }, [])

    if (process.env.NODE_ENV === 'production') {
        return null
    }





    return (
        <>
            <Container>
                <PageHeader title={'Главная страница'}/>

                <div style={{
                    marginTop: '20px',
                    display: 'flex',
                    gap: '20px',
                    flexDirection: 'column',
                    letterSpacing: '1px'
                }}>
                    <h2 style={{fontWeight: '900'}}>
                        <b>Опции</b>
                    </h2>
                    <div className={'message'}>
                        <div className={'message-text'}>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusantium blanditiis in similique.</div>
                        <div className={'message-close'}>X</div>
                    </div>
                </div>
            </Container>
        </>
    )
}