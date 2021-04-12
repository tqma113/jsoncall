import type { JSONType } from './type'
import type { JSONCallType } from './call'

export type BuilderSchema<
  CS extends Record<
    string,
    JSONCallType<string, any, any, string, any, any, string>
  >
> = {
  entry: string
  modules: BuilderModule[]
  calls: CS
}

export type BuilderModule = {
  id: string
  links: TypeLink[]
  types: Record<string, JSONType<any, any, string>>
  derives: Record<string, JSONType<any, any, string>>
  exports: Record<string, JSONType<any, any, string>>
  calls: Record<
    string,
    JSONCallType<string, any, any, string, any, any, string>
  >
}

export type TypeLink = {
  types: LinkType[]
  module: string
}

export type LinkType = {
  type: string
  as: string
}
