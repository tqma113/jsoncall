import {
  createDeriveType,
  type,
  ValidateError,
  NumberType,
  Union,
  StringType,
  normalize,
} from 'jc-builder'
import { check } from 'jc-schema'
import { createBuilderSchema } from './fixtures/ts/createBuilderSchema'
import { createServerService } from './fixtures/ts/createServerService'
import { createClient } from './fixtures/ts/createClient'

describe('verification', () => {
  it('createBuilderSchema', () => {
    expect(check(normalize(createBuilderSchema({ int, Date: DateType })))).toBe(
      null
    )
  })

  it('createServerService', () => {
    const service = createServerService({ int, Date: DateType })
    const app = service({
      fooCall: ({ foo }) => {
        return {
          foo,
        }
      },
      barCall: ({ bar }) => {
        return {
          bar,
        }
      },
      bazCall: ({ baz }) => {
        return {
          baz,
        }
      },
    })
    app('success')
  })

  it('createClient', async () => {
    let input = ''
    const send = async (inStr: string) => {
      input = inStr
      return inStr
    }
    const client = createClient({ int, Date: DateType }, send)

    try {
      await client.fooCall({ foo: 123, baz: true })
    } catch {}
    expect(input).toBe(
      '{"kind":"Single","name":"fooCall","input":"{\\"foo\\":123,\\"baz\\":true}"}'
    )

    try {
      await client.barCall({ foo: 123, bar: 'bar' })
    } catch {}
    expect(input).toBe(
      '{"kind":"Single","name":"barCall","input":"{\\"foo\\":123,\\"bar\\":\\"bar\\"}"}'
    )
    try {
      await client.bazCall({ foo: 123, bar: 'bar', baz: true })
    } catch {}
    expect(input).toBe(
      '{"kind":"Single","name":"bazCall","input":"{\\"foo\\":123,\\"bar\\":\\"bar\\",\\"baz\\":true}"}'
    )
  })
})

const int = createDeriveType(NumberType)(
  'int' as const,
  type(NumberType),
  (input) => {
    if (Number.isInteger(input)) {
      return true
    } else {
      return new ValidateError('int', JSON.stringify(input))
    }
  },
  (input) => {
    return input
  },
  (input) => {
    return input
  },
  'int'
)
const DateType = createDeriveType(Union(StringType, NumberType))(
  'Date' as const,
  type(Union(StringType, NumberType)),
  (input) => {
    const date = new Date(input)
    if (isNaN(date.getTime())) {
      return true
    } else {
      return new ValidateError('Date', JSON.stringify(input))
    }
  },
  (input) => {
    return new Date(input)
  },
  (input) => {
    return input.getTime()
  },
  'Date'
)
