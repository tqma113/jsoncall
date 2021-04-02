import type { ValidateError, ConvertError } from 'jc-builder'
import type { ResolverError } from 'jc-server'

export class SendError extends Error {
  kind = 'Error' as const

  constructor(message: string) {
    super(message)
    this.name = 'SendError'
  }
}

export type ServerErrorType = ValidateError | ConvertError | ResolverError

export class ServerError extends Error {
  kind = 'Error' as const
  err: ServerErrorType

  constructor(message: string, err: ServerErrorType) {
    super(message)
    this.err = err
    this.name = 'ServerError'
  }
}
