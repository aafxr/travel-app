import Avatar from "../../../../components/Avatar/Avatar";

import './UserCard].css'

export default function UserCard({name, vehicle, status, role, avatarURL}){
    return (
        <div className='user-card flex-stretch gap-0.5'>
            <Avatar className='no-resize' src={avatarURL} alt='avatar' />
            <div className='user-card-info column'>
                <div className='user-card-name'>
                    {name}&nbsp;
                    {!!vehicle && <img src={vehicle} alt='vehicle'/>}
                </div>
                {!!status && <div className='user-card-status'>{status}</div>}
            </div>
            {!!role && <div className='user-card-role no-resize'>{status}</div>}
        </div>
    )
}