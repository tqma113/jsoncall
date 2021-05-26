import fs from 'fs'
import path from 'path'
import {
  normalize,
  createDeriveType,
  NumberType,
  type,
  ValidateError,
  StringType,
  Union,
} from 'jc-builder'
import { serverCodegen } from '../src'
import createBuilderSchema from './fixtures/ts/foo'

describe('serverCodegen', () => {
  it('sample', () => {
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
    const builderSchema = createBuilderSchema({ int, Date: DateType })
    const code = serverCodegen(normalize(builderSchema), {
      semi: false,
      singleQuote: true,
      printWidth: 80,
    })

    expect(code).toBe(
      fs.readFileSync(
        path.resolve(__dirname, './fixtures/ts/createServerService.ts'),
        'utf-8'
      )
    )
  })
})
