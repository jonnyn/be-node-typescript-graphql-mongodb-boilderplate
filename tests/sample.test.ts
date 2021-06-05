test('sum numbers', () => {
  expect(1 + 2).toEqual(3)
  expect(2 + 3).toEqual(5)
})

test('adding positive numbers is not zero', () => {
  for (let a = 1; a < 10; a++) {
    for (let b = 1; b < 10; b++) {
      expect(a + b).not.toBe(0)
    }
  }
})