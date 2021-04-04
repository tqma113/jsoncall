import { ValidateError, ConvertError } from 'jc-builder'
import { SerializationError } from 'jc-serialization'
import { JSONCall } from './call'
import { ResolverError, UnknownCallError } from './error'

export type ApiCallOutputError =
  | ValidateError
  | ConvertError
  | ResolverError
  | SerializationError
  | UnknownCallError

export type ApiCallOutput = string | ApiCallOutputError

export type ApiCall<N extends string> = (
  name: N,
  input: string
) => ApiCallOutput

export const createApi = <CS extends JSONCall<string>[]>(...calls: CS) => (
  name: string,
  input: string
) => {
  for (let call of calls) {
    if (call.name === name) {
      return call(input)
    }
  }

  return new UnknownCallError(name)
}

// const a = null as unknown as JSONCall<'foo'>
// const b = null as unknown as JSONCall<'bar'>

// const api = createApi(a, b)
