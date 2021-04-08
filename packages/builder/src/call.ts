import type { JSONType } from './type'

export const JSON_CALL_TYPE_SYMBOL = Symbol('JSON_CALL_TYPE_SYMBOL')

export type JSONCallType<
  N extends string,
  II,
  IT,
  IK extends string,
  OI,
  OT,
  OK extends string
> = {
  [JSON_CALL_TYPE_SYMBOL]: symbol
  name: N
  input: JSONType<II, IT, IK>
  output: JSONType<OI, OT, OK>
  description: string | null
}

export const createJSONCallType = <
  N extends string,
  II,
  IT,
  IK extends string,
  OI,
  OT,
  OK extends string
>(
  name: N,
  input: JSONType<II, IT, IK>,
  output: JSONType<OI, OT, OK>,
  description: string | null = null
): JSONCallType<N, II, IT, IK, OI, OT, OK> => {
  return {
    [JSON_CALL_TYPE_SYMBOL]: JSON_CALL_TYPE_SYMBOL,
    name,
    input,
    output,
    description,
  }
}
