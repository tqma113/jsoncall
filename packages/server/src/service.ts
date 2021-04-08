import {
  Literal,
  ObjectType,
  ToType,
  StringType,
  ListType,
  Union,
  name,
  validate,
  convert,
  ConvertError,
  Naming,
} from 'jc-builder'
import { Serialize, Deserialize, SerializationError } from 'jc-serialization'
import type { ApiCall, ApiCallOutputError } from './api'

// __introspection__ = true is no need since we have tag now.
export const IntrospectionCallingType = Naming(
  'IntrospectionCallingType',
  ObjectType({
    kind: Literal('Introspection' as const),
  })
)
export type IntrospectionCalling = ToType<typeof IntrospectionCallingType>
export const IntrospectionCalling = (): IntrospectionCalling => {
  return {
    kind: 'Introspection',
  }
}

export const SingleCallingType = Naming(
  'SingleCallingType',
  ObjectType({
    kind: Literal('Single' as const),
    name: StringType,
    input: StringType,
  })
)
export type SingleCalling = ToType<typeof SingleCallingType>
export const SingleCalling = (name: string, input: string): SingleCalling => {
  return {
    kind: 'Single',
    name,
    input,
  }
}

// __batch__ = true is no need since we have tag now
export const BatchCallingType = Naming(
  'BatchCallingType',
  ObjectType({
    kind: Literal('Batch' as const),
    callings: ListType(SingleCallingType),
  })
)
export type BatchCalling = ToType<typeof BatchCallingType>
export const BatchCalling = (callings: SingleCalling[]): BatchCalling => {
  return {
    kind: 'Batch',
    callings,
  }
}

export const CallingType = Naming(
  'CallingType',
  Union(SingleCallingType, BatchCallingType, IntrospectionCallingType)
)
export type Calling = ToType<typeof CallingType>

export const CallingSuccessType = Naming(
  'CallingSuccessType',
  ObjectType({
    kind: Literal('CallingSuccess' as const),
    output: StringType,
  })
)
export type CallingSuccess = ToType<typeof CallingSuccessType>
export const CallingSuccess = (output: string): CallingSuccess => {
  return {
    kind: 'CallingSuccess',
    output,
  }
}

export const CallingFailedType = Naming(
  'CallingFailedType',
  ObjectType({
    kind: Literal('CallingFailed' as const),
    message: StringType,
  })
)
export type CallingFailed = ToType<typeof CallingFailedType>
export const CallingFailed = (err: ApiCallOutputError): CallingFailed => {
  return {
    kind: 'CallingFailed',
    message: err.message,
  }
}

export const SingleCallOutputType = Naming(
  'SingleCallOutputType',
  Union(CallingSuccessType, CallingFailedType)
)
export type SingleCallOutput = ToType<typeof SingleCallOutputType>

export const BatchOutputType = Naming(
  'BatchOutputType',
  ObjectType({
    kind: Literal('Batch' as const),
    outputs: ListType(SingleCallOutputType),
  })
)
export type BatchOutput = ToType<typeof BatchOutputType>
export const BatchOutput = (outputs: SingleCallOutput[]): BatchOutput => {
  return {
    kind: 'Batch',
    outputs,
  }
}

export type Service = (input: string) => string

export const createService = <N extends string>(
  api: ApiCall<N>,
  serialize: Serialize<object>,
  deserialize: Deserialize<object>
) => (input: string): string => {
  let result = ''

  try {
    const inputObject = deserialize(input)
    const inputValidateResult = validate(CallingType, inputObject)

    if (inputValidateResult === true) {
      try {
        const input = convert(CallingType, inputObject)
        const handleCalling = (
          name: string,
          input: string
        ): SingleCallOutput => {
          const output = api(name as N, input)
          if (typeof output === 'string') {
            return CallingSuccess(output)
          } else {
            return CallingFailed(output)
          }
        }
        switch (input.kind) {
          case 'Introspection': {
            // TODO: Introspection
            break
          }
          case 'Single': {
            result = serialize(handleCalling(input.name, input.input))
            break
          }
          case 'Batch': {
            result = serialize(
              BatchOutput(
                input.callings.map((input) =>
                  handleCalling(input.name, input.input)
                )
              )
            )
          }
        }
      } catch (err) {
        result = serialize(
          CallingFailed(new ConvertError(err.message, name(CallingType)))
        )
      }
    } else {
      result = serialize(CallingFailed(inputValidateResult))
    }
  } catch (err) {
    result = serialize(CallingFailed(new SerializationError(err, input)))
  }

  return result
}
