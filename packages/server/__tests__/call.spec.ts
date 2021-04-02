// import { NumberType, StringType, createJSONCall } from '../../builder/src/index'

// describe('call', () => {
//   it('simple', () => {
//     const call = createJSONCall(
//       'call',
//       NumberType,
//       StringType
//     )((input) => {
//       return '' + input
//     })

//     expect(call('foo')).toMatchObject({
//       expected: 'number',
//       accept: '"foo"',
//     })
//     expect(call(0)).toBe('0')
//     expect(call(true)).toMatchObject({
//       expected: 'number',
//       accept: 'true',
//     })
//     expect(call(null)).toMatchObject({
//       expected: 'number',
//       accept: 'null',
//     })
//     expect(call({})).toMatchObject({
//       expected: 'number',
//       accept: '{}',
//     })
//     expect(call([])).toMatchObject({
//       expected: 'number',
//       accept: '[]',
//     })
//     expect(call(undefined)).toMatchObject({
//       expected: 'number',
//       accept: undefined,
//     })
//   })
// })
