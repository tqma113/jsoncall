import {
  createJSONType,
  VALIDATE,
  CONVERT,
  REVERSECONVERTER,
} from '../src/index'

describe('constructor>base', () => {
  it('simple', () => {
    const Foo = createJSONType(
      'Foo',
      (input) => {
        return typeof input === 'object'
          ? true
          : `expected object | null | list, accept: ${JSON.stringify(input)}`
      },
      (input: object | null | any[]) => {
        return { foo: input } as const
      },
      (input: { foo: object | null | any[] }) => {
        return input.foo
      }
    )

    expect(Foo[VALIDATE](null)).toBeTruthy()
    expect(Foo[VALIDATE]({})).toBeTruthy()
    expect(Foo[VALIDATE]([])).toBeTruthy()
    expect(Foo[VALIDATE]('foo')).toBe(
      'expected object | null | list, accept: "foo"'
    )
    expect(Foo[VALIDATE](0)).toBe('expected object | null | list, accept: 0')
    expect(Foo[VALIDATE](true)).toBe(
      'expected object | null | list, accept: true'
    )
    expect(Foo[VALIDATE](undefined)).toBe(
      'expected object | null | list, accept: undefined'
    )

    expect(Foo[CONVERT]({})).toMatchObject({ foo: {} })
    expect(Foo[REVERSECONVERTER]({ foo: {} })).toMatchObject({})
    expect(Foo[REVERSECONVERTER](Foo[CONVERT]({}))).toMatchObject({})
  })
})
