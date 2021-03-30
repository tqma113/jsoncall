export class LexicalError extends Error {
  kind = 'LexicalError' as const

  constructor(message: string, line: number, column: number, filename: string) {
    super(message)

    this.name = 'LexicalError'
    this.message = message
    this.stack = `${message} at line: ${line}, column: ${column} in ${filename}`
  }
}

export class SyntaxError extends Error {
  kind = 'SyntaxError' as const

  constructor(message: string, line: number, column: number, filename: string) {
    super(message)

    this.name = 'SyntaxError'
    this.message = message
    this.stack = `${message} at line: ${line}, column: ${column} in ${filename}`
  }
}
