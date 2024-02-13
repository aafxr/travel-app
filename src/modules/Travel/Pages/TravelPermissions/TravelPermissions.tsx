import {useTravel, useUser} from "../../../../contexts/AppContextProvider";
import Container from "../../../../components/Container/Container";
import {useTravelState} from "../../../../hooks/useTravelState";
import Button from "../../../../components/ui/Button/Button";

export default function TravelPermissions(){
    const user= useUser()
    const travel= useTravel()!
    const [state, setState] = useTravelState(travel)


return (
    <div className='wrapper'>
        <Container className='content'>

        </Container>
        <div className='footer-btn-container footer'>
            <Button disabled={state ? !state.change: true}>Сохранить</Button>
        </div>
    </div>
)
}