import Rating from "../Rating/Rating";

import './Comment.css'


/**
 * Компонент отображает коментарий
 * @param {string} author       автор коментария
 * @param {number} rating       оставленный рейтинг ( 1 - 5)
 * @param {string} content      текст коментария
 * @param {Date | string | number} date дата создания коментария
 * @returns {JSX.Element}
 * @category Components
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