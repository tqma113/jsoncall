import { JSONType, validate, convert, reverseConverter, kind } from './type'
import { ValidateError, ConvertError, ResolverError } from './error'

export type InputType<I> = JSONType<any, I, string>
export type OutputType<O> = JSONType<O, any, string>
export type Resolver<I, O> = (input: I) => O

export type JSONCall<I, O> = ((input: I) => O) & {
  name: string
}

export const createJSONCall = <II, IT, OI, OT>(
  name: string,
  input: JSONType<II, IT, string>,
  output: JSONType<OI, OT, string>,
  resolve: Resolver<IT, OT>
): JSONCall<II, OI | ValidateError | ConvertError | ResolverError> => {
  return Object.assign(
    function (data: II): OI | ValidateError | ConvertError | ResolverError {
      const inputValidateResult = validate(input, data)

      if (inputValidateResult === true) {
        try {
          const convertResult = convert(input, data)

          try {
            const resolveResult = resolve(convertResult)
            const result = reverseConverter(output, resolveResult)
            const outputValidateResult = validate(output, result)

            if (outputValidateResult === true) {
              return result
            } else {
              return outputValidateResult
            }
          } catch (err) {
            throw new ResolverError(err, name)
          }
        } catch (err) {
          return new ConvertError(err, kind(input))
        }
      } else {
        return inputValidateResult
      }
    },
    { name }
  )
}
