import {useParams} from "react-router-dom";

import LinkComponent from "../../../../components/ui/LinkComponent/LinkComponent";
import Container from "../../../../components/Container/Container";
import {PageHeader} from "../../../../components/ui";


/**
 * Компоннт для добавления деталей путешествия
 */
export default function TravelParams() {
    const {travelCode} = useParams()

    return (
        <div className='wrapper'>
        <Container>
            <PageHeader arrowBack title='Детали путешествия' />
        </Container>
            <Container className='content'>
                <LinkComponent to={`/travel/${travelCode}/add/plane/`} title='Добавить самолет' arrow />
                <LinkComponent to={`/travel/${travelCode}/add/hotel/`} title='Добавить отель' arrow />
                <LinkComponent to={`/travel/${travelCode}/add/location/`} title='Добавить локацию' arrow />
                <LinkComponent to={`/travel/${travelCode}/add/appointment/`} title='Добавить встречу' arrow />
                <LinkComponent to={`/travel/${travelCode}/add/recommend/`} title='По пути' arrow />
        </Container>
        </div>
    )
}