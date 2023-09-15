import toArray from "../toArray";

test('Test toArray util', () => {
    expect(toArray({}).length).toBe(1)
    expect(toArray().length).toBe(0)
    expect(toArray([,,,{},{},null]).length).toBe(2)
})