import { createJSONType } from '../index'

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

    expect(Foo.validate(null)).toBeTruthy()
    expect(Foo.validate({})).toBeTruthy()
    expect(Foo.validate([])).toBeTruthy()
    expect(Foo.validate('foo')).toBe(
      'expected object | null | list, accept: "foo"'
    )
    expect(Foo.validate(0)).toBe('expected object | null | list, accept: 0')
    expect(Foo.validate(true)).toBe(
      'expected object | null | list, accept: true'
    )
    expect(Foo.validate(undefined)).toBe(
      'expected object | null | list, accept: undefined'
    )

    expect(Foo.convert({})).toMatchObject({ foo: {} })
    expect(Foo.reverseConverter({ foo: {} })).toMatchObject({})
    expect(Foo.reverseConverter(Foo.convert({}))).toMatchObject({})
  })
})
