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
            user_id: user_id.toString(),
            primary_entity_type: 'travel',
            primary_entity_id: '123',
            entity_type: 'excursion',
            entity_id: Date.now().toString(),
            title: 'Колывань историческая',
            value: 12000,
            personal: 1,
            section_id: Math.floor(1 + Math.random() * 5).toString(),
            datetime: new Date().toISOString(),
            created_at: new Date().toISOString()
        })

        const val = JSON.stringify({
            id: id,
            user_id: user_id.toString(),
            primary_entity_type: 'travel',
            primary_entity_id: '123',
            entity_type: 'excursion',
            entity_id: Date.now().toString(),
            title: 'Колывань историческая',
            value: 12000,
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
            display: 'inline-block'
        }}>
            <textarea
                value={areaVal}
                onChange={changeHandler}
                style={{
                    display: 'block',
                    width: '300px',
                    height: '300px',
                    margin: '1rem 10px'
                }}/>
            <button onClick={() => onClick && onClick(JSON.parse(areaVal), type)}>{btnName}</button>
        </div>
    )
}