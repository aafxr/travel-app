import {useTravel, useUser} from "../../../../contexts/AppContextProvider";
import {useCloneStoreEntity} from "../../../../hooks/useCloneStoreEntity";
import Container from "../../../../components/Container/Container";
import Button from "../../../../components/ui/Button/Button";

export default function TravelPermissions(){
    const user= useUser()
    const travel= useTravel()!
    const {item: updatedTravel, change} = useCloneStoreEntity(travel)


return (
    <div className='wrapper'>
        <Container className='content'>

        </Container>
        <div className='footer-btn-container footer'>
            <Button disabled={!change}>Сохранить</Button>
        </div>
    </div>
)
}