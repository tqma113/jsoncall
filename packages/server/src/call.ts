import {
  JSONCallType,
  validate,
  convert,
  controvert,
  name,
  ValidateError,
  ConvertError,
} from 'jc-builder'
import { Result, Ok, Err } from './result'
import { Serialize, Deserialize, SerializationError } from 'jc-serialization'
import { ResolverError } from './error'

export type Resolver<I, O> = (input: I) => O

export type CallError =
  | ValidateError
  | ConvertError
  | ResolverError
  | SerializationError

export type JSONCall<N extends string> = ((
  input: string
) => Result<string, CallError>) & {
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
  resolve: Resolver<IT, OT>,
  serialize: Serialize<any>,
  deserialize: Deserialize<any>
): JSONCall<N> => {
  const obj = {
    [type.name as N]: (data: string): Result<string, CallError> => {
      try {
        const dData = deserialize(data)
        const inputValidateResult = validate(type.input, dData)

        if (inputValidateResult === true) {
          try {
            const convertResult = convert(type.input, dData)

            try {
              const resolveResult = resolve(convertResult)
              const result = controvert(type.output, resolveResult)
              const outputValidateResult = validate(type.output, result)

              if (outputValidateResult === true) {
                return Ok(serialize(result))
              } else {
                return Err(outputValidateResult)
              }
            } catch (err) {
              throw Err(new ResolverError(err instanceof Error ? err.message : JSON.stringify(err), type.name))
            }
          } catch (err) {
            return Err(new ConvertError(err instanceof Error ? err.message : JSON.stringify(err), name(type.input)))
          }
        } else {
          return Err(inputValidateResult)
        }
      } catch (err) {
        return Err(new SerializationError(err instanceof Error ? err : new Error(JSON.stringify(err)), data))
      }
    },
  }

  return obj[type.name] as JSONCall<N>
}
