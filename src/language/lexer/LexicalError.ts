export class LexicalError extends Error {
  kind = 'error' as const

  constructor(message: string, line: number, column: number, filename: string) {
    super(message)

    this.name = 'LexicalError'
    this.message = message
    this.stack = `${message} at line: ${line}, column: ${column} in ${filename}`
  }
}
