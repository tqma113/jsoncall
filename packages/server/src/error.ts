export class ResolverError extends Error {
  kind = 'Error' as const
  callName: string

  constructor(message: string, callName: string) {
    super(message)
    this.callName = callName
    this.name = 'ResolverError'
  }
}
