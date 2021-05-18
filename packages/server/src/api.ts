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

export const createApi =
  <CS extends Record<string, JSONCall<string>>>(calls: CS): ApiCall =>
  (name, input) => {
    for (let key in calls) {
      if (key === name) {
        return calls[key](input)
      }
    }

    return Err(new UnknownCallError(name))
  }
