import React, {useContext, useState} from "react";
import { useNavigate} from "react-router-dom";

import Container from "../../../Expenses/components/Container/Container";

import {TravelContext} from "../../contextProviders/TravelContextProvider";
import createId from "../../../../utils/createId";
import Button from "../../../../components/ui/Button/Button";
import {Input, PageHeader} from "../../../../components/ui";

import '../../css/Travel.css'
import constants from "../../../../static/constants";


export default function TravelAdd({user_id}) {
    const navigate = useNavigate()
    const {travelController} = useContext(TravelContext)

    const [title, setTitle] = useState('')


    function handler() {
        if (travelController && title.length){
            const data = {
                id: createId(),
                code: '',
                title,
                owner_id: user_id,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            }
            travelController.write({
                user_id,
                storeName: constants.store.TRAVEL,
                action:"add",
                data
            })
                .then(()=> navigate('/')) //`/travel/${data.id}/expenses/`
        }
    }


    return (
        <>
            <div className='travel wrapper'>
                <Container className='content hide-scroll'>
                    <PageHeader arrowBack className='travel-destination'>
                        <div className='w-full'>
                            <Input
                                className='travel-destination-input'
                                value={title}
                                onChange={e => setTitle(e.target.value)}
                                placeholder='Куда едем?'
                            />
                        </div>
                    </PageHeader>
                    <div className='column gap'>
                    </div>
                </Container>
                <div className='footer-btn-container footer'>
                    <Button onClick={handler} disabled={!title}>Продолжить</Button>
                </div>
            </div>
        </>
    )
}
