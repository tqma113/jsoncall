import { JSONCall } from './call'
import { UnknownCallError } from './error'

export type ApiCall<N extends string> = (name: N, input: string) => string

export type ApiCallFromJSONCall<
  T extends JSONCall<string>
> = T extends JSONCall<infer N> ? ApiCall<N> : never

export type ApiCallUnion<CS extends JSONCall<string>[]> = CS extends [
  infer Head,
  ...infer Tail
]
  ? Head extends JSONCall<string>
    ? Tail extends JSONCall<string>[]
      ? ApiCallFromJSONCall<Head> | ApiCallUnion<Tail>
      : never
    : never
  : never

export type UnionToIntersection<U> = (
  U extends infer R ? (x: R) => any : never
) extends (x: infer V) => any
  ? V
  : never

export const createApi = <CS extends JSONCall<string>[]>(
  ...calls: CS
): // @ts-ignore
UnionToIntersection<ApiCallUnion<CS>> => (name, input) => {
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
