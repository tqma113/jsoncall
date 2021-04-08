import {
  JSONCallType,
  ValidateError,
  ConvertError,
  name,
  validate,
  convert,
  reverseConverter,
} from 'jc-builder'
import { SendError, ServerError } from './error'
import type { Serialize, Deserialize } from 'jc-serialization'
import type { CallSender, SyncCallSender } from './sender'

export type JSONCall<I, O> = (input: I) => Promise<O>

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
  serialize: Serialize<II>,
  deserialize: Deserialize<OI>,
  send: CallSender<N>
): JSONCall<
  IT,
  OT | ValidateError | ConvertError | SendError | ServerError
> => {
  return async (input) => {
    try {
      const rcResult = reverseConverter(type.input, input)
      const inputValidateResult = validate(type.input, rcResult)
      if (inputValidateResult === true) {
        try {
          const result = deserialize(await send(type.name, serialize(rcResult)))
          const outputValidateResult = validate(type.output, result)
          if (outputValidateResult === true) {
            try {
              return convert(type.output, result)
            } catch (err) {
              return new ConvertError(err, name(type.output))
            }
          } else {
            return new ServerError('Server error', outputValidateResult)
          }
        } catch (err) {
          return new SendError(err)
        }
      } else {
        return inputValidateResult
      }
    } catch (err) {
      return new ConvertError(err, name(type.input))
    }
  }
}

export type SyncJSONCall<I, O> = (input: I) => O

export const createSyncJSONCall = <
  N extends string,
  II,
  IT,
  IK extends string,
  OI,
  OT,
  OK extends string
>(
  type: JSONCallType<N, II, IT, IK, OI, OT, OK>
) => <SO, DI>(
  serialize: Serialize<II>,
  deserialize: Deserialize<OI>,
  send: SyncCallSender<N>
): SyncJSONCall<IT, OI> => {
  return (input) => {
    try {
      const rcResult = reverseConverter(type.input, input)
      const inputValidateResult = validate(type.input, rcResult)
      if (inputValidateResult === true) {
        try {
          const result = deserialize(send(type.name, serialize(rcResult)))
          const outputValidateResult = validate(type.output, result)
          if (outputValidateResult === true) {
            try {
              return convert(type.output, result)
            } catch (err) {
              return new ConvertError(err.message, name(type.output))
            }
          } else {
            return new ServerError('Server error', outputValidateResult)
          }
        } catch (err) {
          return err
        }
      } else {
        return inputValidateResult
      }
    } catch (err) {
      return new ConvertError(err.message, name(type.input))
    }
  }
}
