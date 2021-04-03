import {
  JSONCallType,
  ValidateError,
  ConvertError,
  validate,
  convert,
  reverseConverter,
  kind,
} from 'jc-builder'
import { SendError, ServerError } from './error'
import type { Serialize } from 'jc-serialization'

export type JSONCall<I, O> = (input: I) => Promise<O>
export type CallSender<N extends string, I, O> = (
  name: N,
  input: I
) => Promise<O>

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
) => <SO, DI>(
  serialize: Serialize<II, SO>,
  deserialize: Serialize<DI, OI>,
  send: CallSender<N, SO, DI>
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
              return new ConvertError(err, kind(type.output))
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
      return new ConvertError(err, kind(type.input))
    }
  }
}

export type SyncJSONCall<I, O> = (input: I) => O
export type SyncCallSender<N extends string, I, O> = (name: N, input: I) => O

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
  serialize: Serialize<II, SO>,
  deserialize: Serialize<DI, OI>,
  send: SyncCallSender<N, SO, DI>
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
              return new ConvertError(err, kind(type.output))
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
      return new ConvertError(err, kind(type.input))
    }
  }
}
