import 'setimmediate'
import DataLoader from 'dataloader'
import { kind, validate, convert, ConvertError } from 'jc-builder'
import {
  SingleCalling,
  SingleCallOutputType,
  BatchCalling,
  BatchOutputType,
} from 'jc-server'
import { Serialize, Deserialize, SerializationError } from 'jc-serialization'
import { SendError } from './error'

export type Sender = (input: string) => Promise<string>
export type CallSender<N extends string> = (
  name: N,
  input: string
) => Promise<string>

export const createSender = <N extends string>(
  send: Sender,
  serialize: Serialize<object>,
  deserialize: Deserialize<object>
): CallSender<N> => async (name: N, input: string) => {
  let result = ''

  const callingInput = serialize(SingleCalling(name, input))
  try {
    const output = await send(callingInput)
    try {
      const outputObject = deserialize(output)
      const validateResult = validate(SingleCallOutputType, outputObject)
      if (validateResult === true) {
        try {
          const output = convert(SingleCallOutputType, outputObject)
          switch (output.kind) {
            case 'CallingSuccess': {
              result = output.output
              break
            }
            case 'CallingFailed': {
              throw new Error(output.message)
            }
          }
        } catch (err) {
          throw new ConvertError(err, kind(SingleCallOutputType))
        }
      } else {
        throw validateResult
      }
    } catch (err) {
      throw new SerializationError(err, output)
    }
  } catch (err) {
    throw new SendError(err)
  }

  return result
}

export const createBatchSender = <N extends string>(
  send: Sender,
  serialize: Serialize<object>,
  deserialize: Deserialize<object>
): CallSender<N> => {
  const batchCall = async (
    callings: Readonly<SingleCalling[]>
  ): Promise<string[]> => {
    let input = serialize(BatchCalling(callings as SingleCalling[]))
    try {
      const outputStr = await send(input)
      try {
        const outputObject = deserialize(outputStr)
        const validateResult = validate(BatchOutputType, outputObject)
        if (validateResult === true) {
          try {
            const output = convert(BatchOutputType, outputObject)
            return output.outputs.map((output) => {
              switch (output.kind) {
                case 'CallingSuccess': {
                  return output.output
                }
                case 'CallingFailed': {
                  throw new Error(output.message)
                }
              }
            })
          } catch (err) {
            throw new ConvertError(err, kind(SingleCallOutputType))
          }
        } else {
          throw validateResult
        }
      } catch (err) {
        throw new SerializationError(err, outputStr)
      }
    } catch (err) {
      throw new SendError(err)
    }
  }

  const dataLoader = new DataLoader(batchCall)

  return async (name: N, input: string) => {
    return dataLoader.load(SingleCalling(name, input))
  }
}

export type SyncSender = (input: string) => string
export type SyncCallSender<N extends string> = (
  name: N,
  input: string
) => string

export const createSyncSender = <N extends string>(
  send: SyncSender,
  serialize: Serialize<object>,
  deserialize: Deserialize<object>
): SyncCallSender<N> => (name: N, input: string) => {
  let result = ''

  const callingInput = serialize(SingleCalling(name, input))
  try {
    const output = send(callingInput)
    try {
      const outputObject = deserialize(output)
      const validateResult = validate(SingleCallOutputType, outputObject)
      if (validateResult === true) {
        try {
          const output = convert(SingleCallOutputType, outputObject)
          switch (output.kind) {
            case 'CallingSuccess': {
              result = output.output
              break
            }
            case 'CallingFailed': {
              throw new Error(output.message)
            }
          }
        } catch (err) {
          throw new ConvertError(err, kind(SingleCallOutputType))
        }
      } else {
        throw validateResult
      }
    } catch (err) {
      throw new SerializationError(err, output)
    }
  } catch (err) {
    throw new SendError(err)
  }

  return result
}
