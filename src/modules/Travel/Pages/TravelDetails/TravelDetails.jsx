import Container from "../../../Expenses/components/Container/Container";
import UserCard from "../../components/UserCard/UserCard";

import {BellIcon, CopyIcon, LinkIcon, MenuIcon} from "../../../../components/svg";
import {Chip, PageHeader} from "../../../../components/ui";


export default function TravelDetails() {
    const icons = [<CopyIcon key={1}/>, <LinkIcon key={2}/>, <BellIcon key={3}/>, <MenuIcon key={4}/>]
    return (
        <Container className='column gap-1'>
            <PageHeader arrowBack icons={icons}/>
            <div className='travel-details'>
                <img className='img-abs' src={process.env.PUBLIC_URL + '/images/travel-img.png'} alt="details"/>
            </div>
            <div className='travel-details-title column center'>
                <h2>Едем на Алтай</h2>
            <div className='travel-details-subtitle center'>из Новосибирска - на авто</div>
            </div>
            <div className='center'>
                <Chip className='center' color='orange' rounded>17-21 июля</Chip>
            </div>
            <div className='travel-details-people'>
                <UserCard name='Иван' role='админ' status='в поездке' vehicle={process.env.PUBLIC_URL + '/icons/directions_car.svg'} avatarURL={process.env.PUBLIC_URL + '/images/Ellipse 4.png'}/>
                <UserCard name='Иван' role='админ' status='в поездке' vehicle={process.env.PUBLIC_URL + '/icons/directions_car.svg'} avatarURL={process.env.PUBLIC_URL + '/images/Ellipse 4.png'}/>
                <UserCard name='Иван' role='админ' status='в поездке' vehicle={process.env.PUBLIC_URL + '/icons/directions_car.svg'} avatarURL={process.env.PUBLIC_URL + '/images/Ellipse 4.png'}/>
                <UserCard name='Иван' role='админ' status='в поездке' vehicle={process.env.PUBLIC_URL + '/icons/directions_car.svg'} avatarURL={process.env.PUBLIC_URL + '/images/Ellipse 4.png'}/>
            </div>

        </Container>

    )
}