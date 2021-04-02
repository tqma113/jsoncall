import {
  JSONCallType,
  validate,
  convert,
  reverseConverter,
  kind,
  ValidateError,
  ConvertError,
} from 'jc-builder'
import { ResolverError } from './error'

export type Resolver<I, O> = (input: I) => O

export type JSONCall<I, O> = ((input: I) => O) & {
  name: string
}

export const createJSONCall = <
  N extends string,
  II,
  IT,
  IK extends string,
  OI,
  OT,
  OK extends string
>(
  type: JSONCallType<N, II, IT, IK, OI, OT, OK>
) => (
  resolve: Resolver<IT, OT>
): JSONCall<II, OI | ValidateError | ConvertError | ResolverError> => {
  const obj = {
    [type.name]: function (
      data: II
    ): OI | ValidateError | ConvertError | ResolverError {
      const inputValidateResult = validate(type.input, data)

      if (inputValidateResult === true) {
        try {
          const convertResult = convert(type.input, data)

          try {
            const resolveResult = resolve(convertResult)
            const result = reverseConverter(type.output, resolveResult)
            const outputValidateResult = validate(type.output, result)

            if (outputValidateResult === true) {
              return result
            } else {
              return outputValidateResult
            }
          } catch (err) {
            throw new ResolverError(err, type.name)
          }
        } catch (err) {
          return new ConvertError(err, kind(type.input))
        }
      } else {
        return inputValidateResult
      }
    },
  }

  return obj[type.name]
}
