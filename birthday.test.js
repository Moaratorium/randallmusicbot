//const {birthdayReminderCore, getCurrentDate, intervalConversion, formatDate} = require("./birthdayreminder") 
function sum(a, b) {
    return a + b;
}

test('testing the test, adds 1 + 2 to equal 3', () => {
    expect(sum(1, 2)).toBe(3);
})

test('checks if getCurrentDate returns a date', () => {
    expect(getCurrentDate()).toBeInstanceOf(Date);
})

test('intervalConversion should return a valid integer', () => {
    expect(intervalConversion("14:13")).toBe(51180000);
})

test('formatDate should return a formatted date via a string', () => {
    const testDate = new Date(96, 1, 2, 3, 4, 5);
    expect(formatDate(testDate)).toBe('02/02');
})

// jest.useFakeTimers();
// jest.spyOn(global, 'setInterval');
// test('setInterval should be called once', () => {
//     expect(setInterval).toHaveBeenCalledTimes(1);
// })