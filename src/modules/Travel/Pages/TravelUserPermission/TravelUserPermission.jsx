import {useParams} from "react-router-dom";

import Container from "../../../../components/Container/Container";

export default function TravelUserPermission(){
    const {travelCode, userCode} = useParams()

    return (
        <div className='wrapper'>
            <Container className='content pt-20 pb-20'>
                <dl>
                    <dt>travelCode</dt>
                    <dd>{travelCode}</dd>
                    <dt>userCode</dt>
                    <dd>{userCode}</dd>
                </dl>
            </Container>
            <dl></dl>
        </div>
    )
}