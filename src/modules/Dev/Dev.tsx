import React, {useEffect, useRef, useState} from 'react'
import {useNavigate} from "react-router-dom";

import Container from "../../components/Container/Container";
import {PageHeader, DropDown} from "../../components/ui";
import Input from "../../components/ui/Input/Input";

import './dev.css'



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
                    <DropDown
                        items={['item 1', 'item 2', 'item 3', 'item 4', 'item 5']}
                        node={inputRef}
                        max={3}
                        onSubmit={(item) => console.log(`submit ${item}`)}
                        onSelect={(item) => console.log(`select ${item}`)}
                        onDropDownClose={() => console.log(`close`)}
                        visible={toastVisible}
                    />
                </div>
            </Container>
        </>
    )
}