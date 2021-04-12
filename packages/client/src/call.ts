import {
  JSONCallType,
  ValidateError,
  ConvertError,
  name,
  validate,
  convert,
  contraverte,
} from 'jc-builder'
import { SendError, ServerError } from './error'
import { Result, Ok, Err } from './result'
import type { Serialize, Deserialize } from 'jc-serialization'
import type { CallSender, SyncCallSender } from './sender'

export type JSONCall<I, O> = (input: I) => Promise<O>

export type CallError = ValidateError | ConvertError | SendError | ServerError

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
  serialize: Serialize<any>,
  deserialize: Deserialize<any>,
  send: CallSender<N>
): JSONCall<IT, Result<OT, CallError>> => {
  return async (input) => {
    try {
      const rcResult = contraverte(type.input, input)
      const inputValidateResult = validate(type.input, rcResult)
      if (inputValidateResult === true) {
        try {
          return send(type.name, serialize(rcResult)).then((resultStr) => {
            const result = deserialize(resultStr)
            const outputValidateResult = validate(type.output, result)
            if (outputValidateResult === true) {
              try {
                return Ok(convert(type.output, result))
              } catch (err) {
                return Err(new ConvertError(err, name(type.output)))
              }
            } else {
              return Err(new ServerError('Server error', outputValidateResult))
            }
          })
        } catch (err) {
          return Err(new SendError(err))
        }
      } else {
        return Err(inputValidateResult)
      }
    } catch (err) {
      return Err(new ConvertError(err, name(type.input)))
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
  type: JSONCallType<N, II, IT, IK, OI, OT, OK>,
  serialize: Serialize<any>,
  deserialize: Deserialize<any>,
  send: SyncCallSender<N>
): SyncJSONCall<IT, Result<OT, CallError>> => {
  return (input) => {
    try {
      const rcResult = contraverte(type.input, input)
      const inputValidateResult = validate(type.input, rcResult)
      if (inputValidateResult === true) {
        try {
          const result = deserialize(send(type.name, serialize(rcResult)))
          const outputValidateResult = validate(type.output, result)
          if (outputValidateResult === true) {
            try {
              return Ok(convert(type.output, result))
            } catch (err) {
              return Err(new ConvertError(err, name(type.output)))
            }
          } else {
            return Err(new ServerError('Server error', outputValidateResult))
          }
        } catch (err) {
          return Err(new SendError(err))
        }
      } else {
        return Err(inputValidateResult)
      }
    } catch (err) {
      return Err(new ConvertError(err, name(type.input)))
    }
  }
}
