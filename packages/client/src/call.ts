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

export type CallSender<I, O> = (input: I) => Promise<O>
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
  send: CallSender<II, OI>
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
          const result = await send(rcResult)
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

export type SyncCallSender<I, O> = (input: I) => O
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
) => (send: SyncCallSender<II, OI>): SyncJSONCall<IT, OI> => {
  return (input) => {
    try {
      const rcResult = reverseConverter(type.input, input)
      const inputValidateResult = validate(type.input, rcResult)
      if (inputValidateResult === true) {
        try {
          const result = send(rcResult)
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
