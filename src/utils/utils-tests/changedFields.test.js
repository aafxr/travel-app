import changedFields from "../changedFields";

describe('Test changedFields util', () => {
    test('On same obj should return empty array', () => {
        const testObj = {name: 'test name', value: 42}
        expect(changedFields(testObj, testObj).length).toBe(0)
    })

    test('on different income objects should return correct val', ()=> {
        const testVAl1 = {name:'a',value: 12}
        const testVAl2 = {name:'b',value: 14}

        expect(changedFields().length).toBe(0)
        expect(changedFields(testVAl1, testVAl2).length).toBe(2)
        expect(changedFields(testVAl1, testVAl2, ['id']).length).toBe(3)
        expect(changedFields(testVAl1, testVAl2, []).length).toBe(2)
        expect(changedFields(testVAl1, {...testVAl1, value: 11}).length).toBe(1)
    })
})