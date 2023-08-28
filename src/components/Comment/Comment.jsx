import Rating from "../Rating/Rating";

import './Comment.css'


/**
 *
 * @param {string} author
 * @param {number} rating
 * @param {string} content
 * @param {Date | string | number} date
 * @returns {JSX.Element}
 * @constructor
 */
export default function Comment({author, rating, content, date}) {

    return (
        <div className='comment column gap-0.5'>
            <div className='flex-stretch'>
                <div className='flex-1'>
                    <div className='commant-autor title-bold'>{author}</div>
                    <Rating rating={rating}/>
                </div>
                <div className='comment-date flex-0'>{date}</div>
            </div>
            <div className='comment-content'>{content}</div>
        </div>
    )
}