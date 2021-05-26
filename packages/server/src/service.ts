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
  AnyObjectType,
  BuilderSchema,
  JSONCallType,
  JSONType,
  normalize,
} from 'jc-builder'
import { Serialize, Deserialize, SerializationError } from 'jc-serialization'
import { ApiCallOutputError, createApi } from './api'
import { createJSONCall, Resolver, JSONCall } from './call'

// input
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

// output
export const IntrospectionCallingOutputType = Naming(
  'IntrospectionCallingOutputType',
  ObjectType({
    kind: Literal('IntrospectionCallingOutputType' as const),
    output: AnyObjectType,
  })
)
export type IntrospectionCallingOutput = ToType<
  typeof IntrospectionCallingOutputType
>
export const IntrospectionCallingOutput = (
  output: object
): IntrospectionCallingOutput => {
  return {
    kind: 'IntrospectionCallingOutputType',
    output,
  }
}

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
export type ResolverI<
  T extends JSONCallType<string, any, any, string, any, any, string>
> = T extends JSONCallType<string, any, infer I, string, any, any, string>
  ? I
  : never
export type ResolverO<
  T extends JSONCallType<string, any, any, string, any, any, string>
> = T extends JSONCallType<string, any, any, string, any, infer O, string>
  ? O
  : never
export type Resolvers<
  CS extends Record<
    string,
    JSONCallType<string, any, any, string, any, any, string>
  >
> = {
  [K in keyof CS]: Resolver<ResolverI<CS[K]>, ResolverO<CS[K]>>
}

export const createService =
  <
    TS extends Record<string, JSONType<any, any, string>>,
    DS extends Record<string, JSONType<any, any, string>>,
    CS extends Record<
      string,
      JSONCallType<string, any, any, string, any, any, string>
    >
  >(
    schema: BuilderSchema<TS, DS, CS>,
    serialize: Serialize<object>,
    deserialize: Deserialize<object>
  ) =>
  (resolvers: Resolvers<CS>) =>
  (input: string): string => {
    const calls = getKeys(schema.calls).reduce((cur, key) => {
      cur[key] = createJSONCall(
        schema.calls[key],
        resolvers[key],
        serialize,
        deserialize
      )
      return cur
    }, {} as Record<keyof CS, JSONCall<string>>)
    const api = createApi(calls)
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
            const result = api(name, input)
            if (result.isOk) {
              return CallingSuccess(result.value)
            } else {
              return CallingFailed(result.value)
            }
          }
          switch (input.kind) {
            case 'Introspection': {
              return serialize(IntrospectionCallingOutput(normalize(schema)))
            }
            case 'Single': {
              return serialize(handleCalling(input.name, input.input))
            }
            case 'Batch': {
              return serialize(
                BatchOutput(
                  input.callings.map((input) =>
                    handleCalling(input.name, input.input)
                  )
                )
              )
            }
          }
        } catch (err) {
          return serialize(
            CallingFailed(new ConvertError(err.message, name(CallingType)))
          )
        }
      } else {
        return serialize(CallingFailed(inputValidateResult))
      }
    } catch (err) {
      return serialize(CallingFailed(new SerializationError(err, input)))
    }
  }

function getKeys<T extends {}>(o: T): Array<keyof T> {
  return Object.keys(o) as Array<keyof T>
}
