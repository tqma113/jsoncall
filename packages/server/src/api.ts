import { JSONCall, CallError } from './call'
import { UnknownCallError } from './error'
import { Result, Err } from './result'

export type ApiCallOutputError = CallError | UnknownCallError

export type ApiCall = (
  name: string,
  input: string
) => Result<string, ApiCallOutputError>

export type Names<CS extends JSONCall<string>[]> = CS extends JSONCall<
  infer N
>[]
  ? N
  : never

export const createApi = <CS extends JSONCall<string>[]>(
  ...calls: CS
): ApiCall => (name, input) => {
  for (let call of calls) {
    if (call.name === name) {
      return call(input)
    }
  }

  return Err(new UnknownCallError(name))
}

// const a = null as unknown as JSONCall<'foo'>
// const b = null as unknown as JSONCall<'bar'>

// const api = createApi(a, b)
