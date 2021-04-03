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
import { Serialize, SerializationError } from 'jc-serialization'

export type Resolver<I, O> = (input: I) => O

export type JSONCall<N extends string, I, O> = ((input: I) => O) & {
  name: N
}

export const createJSONCall = <
  N extends string,
  II,
  IT,
  IK extends string,
  OI,
  OT,
  OK extends string,
  SO,
  DI
>(
  type: JSONCallType<N, II, IT, IK, OI, OT, OK>,
  serialize: Serialize<OI, SO>,
  deserialize: Serialize<DI, II>
) => {
  const apply = (
    data: DI,
    resolve: Resolver<IT, OT>
  ): SO | ValidateError | ConvertError | ResolverError | SerializationError => {
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
  }

  return (
    resolve: Resolver<IT, OT>
  ): JSONCall<
    N,
    DI,
    SO | ValidateError | ConvertError | ResolverError | SerializationError
  > => {
    const obj = {
      [type.name]: Object.assign(
        function (data: DI) {
          return apply(data, resolve)
        },
        { name: type.name }
      ),
    }

    return obj[type.name]
  }
}
