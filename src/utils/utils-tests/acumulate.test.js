import accumulate from "../accumulate";


const data = [
    {type: 'name', value: 2},
    {type: 'name', value: 5},
    {type: 'name', value: 4},
    {type: 'name', value: -7},
    {type: 'name', value: 0},
]
describe('accumulate util', () =>{
    test('If pass array util should return number', ()=>{
        expect(accumulate(data, d => d.value)).toBe(4)
        expect(accumulate(data.slice(0,2), d => d.value)).toBe(7)
        expect(accumulate(data.slice(0,4), d => d.value)).toBe(4)
    })
    test('If pass single element should return transformed value', ()=>{
        expect(accumulate(data[0], d => d.value)).toBe(2)
        expect(accumulate(data[3], d => d.value)).toBe(-7)
        expect(accumulate(data[4], d => d.value)).toBe(0)
        expect(accumulate(data[1], d => d.value)).toBe(5)
    })
    test('If pass undefined or null should return 0', () =>{
        expect(accumulate(undefined, d => d.value)).toBe(0)
        expect(accumulate(null, d => d.value)).toBe(0)
    })
    test("If array contain undefined or null should ignore this value", () => {
        data.push()
        data.push(null)
        data[1] = undefined
        expect(accumulate(data, d => d.value)).toBe(-1)
    })
})