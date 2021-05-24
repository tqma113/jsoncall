import type { JSONType } from './types'
import type { JSONCallType } from './call'

export type BuilderSchema<
  TS extends Record<string, JSONType<any, any, string>>,
  DS extends Record<string, JSONType<any, any, string>>,
  CS extends Record<
    string,
    JSONCallType<string, any, any, string, any, any, string>
  >
> = {
  types: TS
  derives: DS
  calls: CS
}

export const createBuilderSchema = <
  TS extends Record<string, JSONType<any, any, string>>,
  DS extends Record<string, JSONType<any, any, string>>,
  CS extends Record<
    string,
    JSONCallType<string, any, any, string, any, any, string>
  >
>(
  types: TS,
  derives: DS,
  calls: CS
): BuilderSchema<TS, DS, CS> => {
  return {
    types,
    derives,
    calls,
  }
}
