import type { Source } from './source'
import type { Token } from './token'
import type { Fragment } from './ast'

export class LexicalError extends Error {
  kind = 'LexicalError' as const
  source: Source

  constructor(message: string, line: number, column: number, source: Source) {
    super(message)

    this.name = 'LexicalError'
    this.source = source
    this.message = `${message} at line: ${line}, column: ${column} in ${source.filepath}`
  }
}

export class SyntaxError extends Error {
  kind = 'SyntaxError' as const
  token: Token
  source: Source

  constructor(message: string, token: Token, source: Source) {
    super(message)

    this.name = 'SyntaxError'
    this.token = token
    this.source = source
    this.message = `${message} at line: ${token.range.line}, column: ${token.range.column} in ${source.filepath}`
  }
}

export class SemanticError extends Error {
  kind = 'SemanticError' as const
  fragment: Fragment
  source: Source

  constructor(message: string, fragment: Fragment, source: Source) {
    super(message)

    this.name = 'SemanticError'
    this.fragment = fragment
    this.source = source
    this.message = `${message} start at line: ${fragment.location.startToken.range.line}, column: ${fragment.location.startToken.range.column}, end at line: ${fragment.location.endToken.range.line}, column: ${fragment.location.endToken.range.column} in ${source.filepath}`
  }
}

export class BundleError extends Error {
  kind = 'BundleError' as const

  constructor(message: string, entry: string) {
    super(message)

    this.name = 'BundleError'
    this.message = `${message}, entry path: ${entry}`
  }
}
