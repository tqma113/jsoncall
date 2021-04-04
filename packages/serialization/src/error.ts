export class SerializationError extends Error {
  kind = 'Error' as const
  err: Error
  input: any

  constructor(err: Error, input: any) {
    super(`input: ${input}, ${err.message}`)
    this.err = err
    this.input = input
    this.name = 'SerializationError'
  }
}
