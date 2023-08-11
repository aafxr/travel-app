import clsx from "clsx";

import Avatar from "../../../../components/Avatar/Avatar";

import './UserCard.css'


/**
 *
 * @param {string} name
 * @param {string} vehicle
 * @param {string} status
 * @param {string} role
 * @param {string} avatarURL
 * @param {boolean} compact
 * @return {JSX.Element}
 * @constructor
 */
export default function UserCard({name, vehicle, status, role, avatarURL, compact = false}) {
    return (
        <div className={clsx('user-card',
            {
                'flex-stretch gap-0.5': !compact,
                'compact': compact
            }
        )}>
            <Avatar className='no-resize' src={avatarURL} alt='avatar'/>
            {!compact && (
                <>
                    <div className='user-card-info column'>
                        <div className='user-card-name'>
                            {name}&nbsp;
                            {!!vehicle && <img src={vehicle} alt='vehicle'/>}
                        </div>
                        {!!status && <div className='user-card-status'>{status}</div>}
                    </div>
                    {!!role && <div className='user-card-role no-resize'>{role}</div>}
                </>
            )}
        </div>
    )
}