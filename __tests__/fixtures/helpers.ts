import {
  createDeriveType,
  type,
  ValidateError,
  NumberType,
  Union,
  StringType,
} from 'jc-builder'
import { createServerService } from './ts/createServerService'
import {
  createClient,
  createBatchClient,
  createSyncClient,
} from './ts/createClient'

const int = () =>
  createDeriveType(NumberType)(
    '' as const,
    () => type(NumberType),
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
    () => 'int'
  )
const DateType = () =>
  createDeriveType(Union(StringType, NumberType))(
    '' as const,
    () => type(Union(StringType, NumberType)),
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
    () => 'Date'
  )

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

export const client = createClient({ int, Date: DateType }, async (input) => {
  return app(input)
})

export const batchClient = createBatchClient(
  { int, Date: DateType },
  async (input) => {
    return app(input)
  }
)

export const syncClient = createSyncClient({ int, Date: DateType }, (input) => {
  return app(input)
})
