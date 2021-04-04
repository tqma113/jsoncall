// __introspection__ = true is no need since we have tag now.
export type IntrospectionCalling = {
  kind: 'Introspection'
}

export type SingleCalling = {
  kind: 'Single'
  path: string
  input: string
}

// __batch__ = true is no need since we have tag now
export type BatchCalling = {
  kind: 'Batch'
  callings: Readonly<SingleCalling[]>
}

export type Calling = SingleCalling | BatchCalling | IntrospectionCalling

export type CallingOutput = string
