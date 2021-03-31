import type { Source } from './source'
import type { Token } from './token'

export class LexicalError extends Error {
  kind = 'LexicalError' as const

  constructor(message: string, line: number, column: number, source: Source) {
    super(message)

    this.name = 'LexicalError'
    this.message = message
    this.stack = `${message} at line: ${line}, column: ${column} in ${source.filepath}`
  }
}

export class SyntaxError extends Error {
  kind = 'SyntaxError' as const

  constructor(message: string, token: Token, source: Source) {
    super(message)

    this.name = 'SyntaxError'
    this.message = message
    this.stack = `${message} at line: ${token.range.line}, column: ${token.range.column} in ${source.filepath}`
  }
}
