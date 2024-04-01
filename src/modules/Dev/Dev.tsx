import React, {useEffect, useRef, useState} from 'react'
import {useNavigate} from "react-router-dom";

import Container from "../../components/Container/Container";
import {PageHeader, DropDown} from "../../components/ui";
import Input from "../../components/ui/Input/Input";

import './dev.css'
import {PlaceStepCard} from "../Travel/Pages/TravelMain/steps/PlaceStepCard";
import {PlaceStep} from "../../classes/StoreEntities/route/PlaceStep";



export function Dev() {
    const navigate = useNavigate()
    const [toastVisible, setToastVisible] = useState(false)
    const inputRef = useRef<HTMLInputElement>(null)


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
                    <Input
                        ref={inputRef}
                        onFocus={() => setToastVisible(true)}
                        // onBlur ={() => setToastVisible(false)}
                    />
                    {/*<DropDown*/}
                    {/*    items={['item 1', 'item 2', 'item 3']}*/}
                    {/*    node={inputRef}*/}
                    {/*    max={5}*/}
                    {/*    onSubmit={console.log}*/}
                    {/*    visible={toastVisible}*/}
                    {/*/>*/}
                </div>
            </Container>
        </>
    )
}