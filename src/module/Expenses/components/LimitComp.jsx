import React, {useEffect, useState} from 'react'


export default function ExpenseComp({
                                        user_id,
                                        primary_entity_id,
                                        id,
                                        onClick,
                                        btnName,
                                        type
                                    }) {
    const [expenseData, setExpenseData] = useState(null)
    const [areaVal, setAreaVal] = useState('')


    useEffect(() => {
        setExpenseData({
            id: id,
            hidden: 0,
            color: '#123abc',
            title: 'Hotel',
            value: 3200,
            personal: 1,
            section_id: Math.floor(1 + Math.random() * 5).toString(),
            datetime: new Date().toISOString(),
            created_at: new Date().toISOString()
        })

        const val = JSON.stringify({
            id: id,
            hidden: 0,
            color: '#123abc',
            title: 'Hotel',
            value: 3200,
            personal: 1,
            section_id: Math.floor(1 + Math.random() * 5).toString(),
            datetime: new Date().toISOString(),
            created_at: new Date().toISOString()
        }, null,2)
        setAreaVal(val)

    }, [])


    function changeHandler(e) {
        setAreaVal(e.target.value)
    }

    return (
        <div style={{
            display: 'inline-block',
            marginTop:'1rem'
        }}>
            <textarea
                value={areaVal}
                onChange={changeHandler}
                style={{
                    display: 'block',
                    width: '300px',
                    height: '200px',
                    margin: '0 10px'
                }}/>
            <button onClick={() => onClick && onClick(JSON.parse(areaVal), type)}>{btnName}</button>
        </div>
    )
}