import { JSONCall } from './call'

export type ServiceCall<N extends string, O> = (name: N, input: string) => O

export type ServiceCallFromJSONCall<
  T extends JSONCall<string, any, any>
> = T extends JSONCall<infer N, any, infer O> ? ServiceCall<N, O> : never

export type ServiceCallUnion<
  CS extends JSONCall<string, any, any>[]
> = CS extends [infer Head, ...infer Tail]
  ? Head extends JSONCall<string, any, any>
    ? Tail extends JSONCall<string, any, any>[]
      ? ServiceCallFromJSONCall<Head> | ServiceCallUnion<Tail>
      : never
    : never
  : never

export type UnionToIntersection<U> = (
  U extends infer R ? (x: R) => any : never
) extends (x: infer V) => any
  ? V
  : never

// @ts-ignore
export const createService = <CS extends JSONCall<string, any, any>[]>(
  ...calls: CS
): UnionToIntersection<ServiceCallUnion<CS>> => (name, input) => {}

// __introspection__ = true is no need since we have tag now.
export type IntrospectionCalling = {
  type: 'Introspection'
}

export type SingleCalling = {
  type: 'Single'
  path: string
  input: string
}

// __batch__ = true is no need since we have tag now
export type BatchCalling = {
  type: 'Batch'
  callings: Readonly<SingleCalling[]>
}

export type Calling = SingleCalling | BatchCalling | IntrospectionCalling

export type CallingOutput = string
