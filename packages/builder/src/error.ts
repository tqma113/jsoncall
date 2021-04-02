export class ValidateError extends Error {
  kind = 'Error' as const
  expected: string
  accept: string

  constructor(expected: string, accept: string) {
    super(`expected: ${expected}, accept: ${accept}`)

    this.name = 'ValidateError'
    this.accept = accept
    this.expected = expected
  }
}

export class ConvertError extends Error {
  kind = 'Error' as const
  type: string

  constructor(message: string, type: string) {
    super(message)
    this.type = type
    this.name = 'ValidateError'
  }
}
export class ResolverError extends Error {
  kind = 'Error' as const
  callName: string

  constructor(message: string, callName: string) {
    super(message)
    this.callName = callName
    this.name = 'ResolverError'
  }
}
