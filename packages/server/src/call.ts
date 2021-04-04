import {
  JSONCallType,
  validate,
  convert,
  reverseConverter,
  kind,
  ValidateError,
  ConvertError,
} from 'jc-builder'
import { Serialize, Deserialize, SerializationError } from 'jc-serialization'
import { ResolverError } from './error'

export type Resolver<I, O> = (input: I) => O

export type JSONCall<N extends string> = ((
  input: string
) =>
  | string
  | ValidateError
  | ConvertError
  | ResolverError
  | SerializationError) & {
  name: N
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
  type: JSONCallType<N, II, IT, IK, OI, OT, OK>,
  resolve: Resolver<IT, OT>
) => (serialize: Serialize<OI>, deserialize: Deserialize<II>): JSONCall<N> => {
  const obj = {
    [type.name as N]: (
      data: string
    ):
      | string
      | ValidateError
      | ConvertError
      | ResolverError
      | SerializationError => {
      try {
        const dData = deserialize(data)
        const inputValidateResult = validate(type.input, dData)

        if (inputValidateResult === true) {
          try {
            const convertResult = convert(type.input, dData)

            try {
              const resolveResult = resolve(convertResult)
              const result = reverseConverter(type.output, resolveResult)
              const outputValidateResult = validate(type.output, result)

              if (outputValidateResult === true) {
                return serialize(result)
              } else {
                return outputValidateResult
              }
            } catch (err) {
              throw new ResolverError(err.message, type.name)
            }
          } catch (err) {
            return new ConvertError(err, kind(type.input))
          }
        } else {
          return inputValidateResult
        }
      } catch (err) {
        return new SerializationError(err, data)
      }
    },
  }

  return obj[type.name] as JSONCall<N>
}
