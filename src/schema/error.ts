export class ValidateError extends Error {
  kind = 'ValidateError' as const

  constructor(message: string) {
    super(message)

    this.name = 'LexicalError'
    this.message = message
  }
}
