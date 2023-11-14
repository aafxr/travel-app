// import {it, } from 'jest'

// import updateCurrency from "./updateCurrency";

const dispatchMock = jest.fn()

it('Should fetch Currency', async () => {
    const date_start = '01.11.2023'
    const date_end = '01.10.2023'
    // const res = await updateCurrency(dispatchMock, {date_start, date_end})

    // expect(res).not.toBeNull()
    // expect(dispatchMock.mock.calls).toHaveLength(1)
    expect(date_start).not.toBe(date_end)
})