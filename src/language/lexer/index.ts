import { Comment, createToken, TokenKind, OperatorEnum, StringLiteral, NumberLiteral, NullLiteral, BooleanLiteral, Name } from './token'
import { LexicalError } from './LexicalError'
import { Token } from './token'

export type Lexer = {
  source: Readonly<string>
  filename: Readonly<string>

  /**
   * The previously focused non-ignored token.
   */
  lastToken: Token

  /**
   * The currently focused non-ignored token.
   */
  token: Token

  /**
   * The (1-indexed) line containing the current token.
   */
  line: number

  /**
   * The character offset at which the current line begins.
   */
  offset: number

  next(): Token
}

export const createLexer = (source: Readonly<string>, filename: string): Lexer => {
  const SOFToken: Token = createToken(
    TokenKind.SOF,
    void 0,
    0, 0, 0, 0,
    null
  )

  const lookahead = (): Token => {
    let token = lexer.token
    if (token.kind !== TokenKind.EOF) {
      do {
        // Note: next is only mutable during parsing, so we cast to allow this.
        token = token.next ?? (token.next = readToken(token))
      } while (token.kind === TokenKind.COMMENT)
    }
    return token
  }

  const next = (): Token => {
    lexer.lastToken = lexer.token
    const token = (lexer.token = lookahead())
    return token
  }

  const lexer: Lexer = {
    source,
    filename,
    lastToken: SOFToken,
    token: SOFToken,
    line: 1,
    offset: 0,
    next
  }
  const length = source.length

  const readToken = (prev: Token): Token => {
    const source = lexer.source

    let pos = prev.range.end
    while (pos < length) {
      const code = source.charCodeAt(pos)

      const line = lexer.line
      const col = 1 + pos - lexer.offset

      switch (code) {
        case 0xfeff: // <BOM>
        case 9: //   \t
        case 32: //  <space>
        case 10: //  \n
          ++pos
          ++lexer.line
          lexer.offset = pos
          continue
        case 13: //  \r
          if (source.charCodeAt(pos + 1) === 10) {
            pos += 2
          } else {
            ++pos
          }
          ++lexer.line
          lexer.offset = pos
          continue
        case 35: //  #
          return readComment(pos, line, col, prev)
        case 38: //  &
          return createToken(TokenKind.OPERATOR, OperatorEnum.Union, pos, pos + 1, line, col, prev)
        case 40: //  (
          return createToken(TokenKind.OPERATOR, OperatorEnum.OpenParen, pos, pos + 1, line, col, prev)
        case 41: //  )
          return createToken(TokenKind.OPERATOR, OperatorEnum.CloseParen, pos, pos + 1, line, col, prev)
        case 44: //  ,
          return createToken(TokenKind.OPERATOR, OperatorEnum.Comma, pos, pos + 1, line, col, prev)
        case 58: //  :
          return createToken(TokenKind.OPERATOR, OperatorEnum.Colon, pos, pos + 1, line, col, prev)
        case 61: //  =
          if (source.charCodeAt(pos + 1) === 62) {
            return createToken(TokenKind.OPERATOR, OperatorEnum.Output, pos, pos + 2, line, col, prev)
          } else {
            return createToken(TokenKind.OPERATOR, OperatorEnum.Assign, pos, pos + 1, line, col, prev)
          }
        case 91: //  [
          return createToken(TokenKind.OPERATOR, OperatorEnum.OpenBracket, pos, pos + 1, line, col, prev)
        case 93: //  ]
          return createToken(TokenKind.OPERATOR, OperatorEnum.CloseBracket, pos, pos + 1, line, col, prev)
        case 123: // {
          return createToken(TokenKind.OPERATOR, OperatorEnum.OpenBrace, pos, pos + 1, line, col, prev)
        case 124: // |
          return createToken(TokenKind.OPERATOR, OperatorEnum.Intersect, pos, pos + 1, line, col, prev)
        case 125: // }
          return createToken(TokenKind.OPERATOR, OperatorEnum.CloseBrace, pos, pos + 1, line, col, prev)
        case 34: //  "
          return readString(pos, line, col, prev)
        case 43: //  +
        case 45: //  -
        case 48: //  0
        case 49: //  1
        case 50: //  2
        case 51: //  3
        case 52: //  4
        case 53: //  5
        case 54: //  6
        case 55: //  7
        case 56: //  8
        case 57: //  9
          return readNumber(pos, code, line, col, prev)
        case 65: //  A
        case 66: //  B
        case 67: //  C
        case 68: //  D
        case 69: //  E
        case 70: //  F
        case 71: //  G
        case 72: //  H
        case 73: //  I
        case 74: //  J
        case 75: //  K
        case 76: //  L
        case 77: //  M
        case 78: //  N
        case 79: //  O
        case 80: //  P
        case 81: //  Q
        case 82: //  R
        case 83: //  S
        case 84: //  T
        case 85: //  U
        case 86: //  V
        case 87: //  W
        case 88: //  X
        case 89: //  Y
        case 90: //  Z
        case 95: //  _
        case 97: //  a
        case 98: //  b
        case 99: //  c
        case 100: // d
        case 101: // e
        case 102: // f
        case 103: // g
        case 104: // h
        case 105: // i
        case 106: // j
        case 107: // k
        case 108: // l
        case 109: // m
        case 110: // n
        case 111: // o
        case 112: // p
        case 113: // q
        case 114: // r
        case 115: // s
        case 116: // t
        case 117: // u
        case 118: // v
        case 119: // w
        case 120: // x
        case 121: // y
        case 122: // z
          return readName(pos, line, col, prev)
      }

      throw new LexicalError(`Unknown token:  ${source[pos]}`, line, col, filename);
    }

    const line = lexer.line
    const col = 1 + pos - lexer.offset
    return createToken(TokenKind.EOF, void 0, length, length, line, col, prev)
  }

  const readComment = (
    start: number,
    line: number,
    col: number,
    prev: Token | null
  ): Comment => {
    const source = lexer.source
    let code = 0
    let position = start

    do {
      code = source.charCodeAt(++position);
    } while (
      !isNaN(code) &&
      // SourceCharacter but not LineTerminator
      (code > 0x001f || code === 0x0009)
    )

    return createToken(TokenKind.COMMENT, source.slice(start + 1, position), start, position, line, col, prev)
  }

  const readString = (
    start: number,
    line: number,
    col: number,
    prev: Token | null
  ): StringLiteral | NullLiteral | BooleanLiteral => {

  }

  const readNumber = (
    start: number,
    firstCode: number,
    line: number,
    col: number,
    prev: Token | null,
  ): NumberLiteral => {

  }

  const readName = (
    start: number,
    line: number,
    col: number,
    prev: Token | null,
  ): Name => {

  }

  return lexer
}
