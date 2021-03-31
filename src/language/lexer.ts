import {
  Comment,
  createToken,
  TokenKind,
  OperatorEnum,
  StringLiteral,
  NumberLiteral,
  BooleanLiteral,
  Name,
  BooleanEnum,
  KeywordEnum,
  Keyword,
  PrimitiveTypeEnum,
  PrimitiveType,
  SpecialType,
  SpecialTypeEnum,
  Token,
} from './token'
import { Source } from './source'
import { LexicalError } from './error'

export type Lexer = {
  source: Readonly<Source>

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
  lineStart: number

  next(): Token

  run(): Token

  lookahead(): Token
}

export const createLexer = (
  source: Readonly<Source>,
): Lexer => {
  const SOFToken: Token = createToken(TokenKind.SOF, void 0, 0, 0, 0, 0, null)

  const lookahead = (): Token => {
    let token = lexer.token
    if (token.kind !== TokenKind.EOF) {
      token = token.next ?? (token.next = readToken(token))
    }
    return token
  }

  const next = (): Token => {
    lexer.lastToken = lexer.token
    const token = (lexer.token = lookahead())
    return token
  }

  const run = (): Token => {
    while (next().kind !== TokenKind.EOF);
    return SOFToken
  }

  const lexer: Lexer = {
    source,
    lastToken: SOFToken,
    token: SOFToken,
    line: 1,
    lineStart: 0,
    next,
    run,
    lookahead,
  }
  const length = source.content.length

  const readToken = (prev: Token): Token => {
    const content = lexer.source.content

    let pos = prev.range.end
    while (pos < length) {
      const code = content.charCodeAt(pos)

      const line = lexer.line
      const col = 1 + pos - lexer.lineStart

      switch (code) {
        case 0xfeff: // <BOM>
        case 9: //   \t
        case 32: //  <space>
          ++pos
          continue
        case 10: //  \n
          ++pos
          ++lexer.line
          lexer.lineStart = pos
          continue
        case 13: //  \r
          if (content.charCodeAt(pos + 1) === 10) {
            pos += 2
          } else {
            ++pos
          }
          ++lexer.line
          lexer.lineStart = pos
          continue
        case 35: //  #
          return readComment(pos, line, col, prev)
        case 38: //  &
          return createToken(
            TokenKind.OPERATOR,
            OperatorEnum.Intersect,
            pos,
            pos + 1,
            line,
            col,
            prev
          )
        case 40: //  (
          return createToken(
            TokenKind.OPERATOR,
            OperatorEnum.OpenParen,
            pos,
            pos + 1,
            line,
            col,
            prev
          )
        case 41: //  )
          return createToken(
            TokenKind.OPERATOR,
            OperatorEnum.CloseParen,
            pos,
            pos + 1,
            line,
            col,
            prev
          )
        case 44: //  ,
          return createToken(
            TokenKind.OPERATOR,
            OperatorEnum.Comma,
            pos,
            pos + 1,
            line,
            col,
            prev
          )
        case 58: //  :
          return createToken(
            TokenKind.OPERATOR,
            OperatorEnum.Colon,
            pos,
            pos + 1,
            line,
            col,
            prev
          )
        case 61: //  =
          if (content.charCodeAt(pos + 1) === 62) {
            return createToken(
              TokenKind.OPERATOR,
              OperatorEnum.Output,
              pos,
              pos + 2,
              line,
              col,
              prev
            )
          } else {
            return createToken(
              TokenKind.OPERATOR,
              OperatorEnum.Assign,
              pos,
              pos + 1,
              line,
              col,
              prev
            )
          }
        case 91: //  [
          return createToken(
            TokenKind.OPERATOR,
            OperatorEnum.OpenBracket,
            pos,
            pos + 1,
            line,
            col,
            prev
          )
        case 93: //  ]
          return createToken(
            TokenKind.OPERATOR,
            OperatorEnum.CloseBracket,
            pos,
            pos + 1,
            line,
            col,
            prev
          )
        case 123: // {
          return createToken(
            TokenKind.OPERATOR,
            OperatorEnum.OpenBrace,
            pos,
            pos + 1,
            line,
            col,
            prev
          )
        case 124: // |
          return createToken(
            TokenKind.OPERATOR,
            OperatorEnum.Union,
            pos,
            pos + 1,
            line,
            col,
            prev
          )
        case 125: // }
          return createToken(
            TokenKind.OPERATOR,
            OperatorEnum.CloseBrace,
            pos,
            pos + 1,
            line,
            col,
            prev
          )
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

      throw new LexicalError(
        `Unknown token:  ${content[pos]}`,
        line,
        col,
        source
      )
    }

    const line = lexer.line
    const col = 1 + pos - lexer.lineStart
    return createToken(TokenKind.EOF, void 0, length, length, line, col, prev)
  }

  const readComment = (
    start: number,
    line: number,
    col: number,
    prev: Token | null
  ): Comment => {
    const content = lexer.source.content
    let code = 0
    let position = start

    do {
      code = content.charCodeAt(++position)
    } while (
      !isNaN(code) &&
      // SourceCharacter but not LineTerminator
      (code > 0x001f || code === 0x0009)
    )

    return createToken(
      TokenKind.COMMENT,
      content.slice(start + 1, position),
      start,
      position,
      line,
      col,
      prev
    )
  }

  const readString = (
    start: number,
    line: number,
    col: number,
    prev: Token | null
  ): StringLiteral => {
    const content = lexer.source.content
    let position = start + 1
    let chunkStart = position
    let code = 0
    let value = ''

    while (
      position < length &&
      !isNaN((code = content.charCodeAt(position))) &&
      // not LineTerminator
      code !== 0x000a &&
      code !== 0x000d
    ) {
      // Closing Quote (")
      if (code === 34) {
        value += content.slice(chunkStart, position)
        return createToken(
          TokenKind.STRING,
          value,
          start,
          position + 1,
          line,
          col,
          prev
        )
      }

      // SourceCharacter
      if (code < 0x0020 && code !== 0x0009) {
        throw new LexicalError(
          `Invalid character within String: ${printCharCode(code)}.`,
          line,
          col + (position - start),
          lexer.source
        )
      }

      ++position
      if (code === 92) {
        // \
        value += content.slice(chunkStart, position - 1)
        code = content.charCodeAt(position)
        switch (code) {
          case 34:
            value += '"'
            break
          case 47:
            value += '/'
            break
          case 92:
            value += '\\'
            break
          case 98:
            value += '\b'
            break
          case 102:
            value += '\f'
            break
          case 110:
            value += '\n'
            break
          case 114:
            value += '\r'
            break
          case 116:
            value += '\t'
            break
          case 117: {
            // uXXXX
            const charCode = uniCharCode(
              content.charCodeAt(position + 1),
              content.charCodeAt(position + 2),
              content.charCodeAt(position + 3),
              content.charCodeAt(position + 4)
            )
            if (charCode < 0) {
              const invalidSequence = content.slice(position + 1, position + 5)
              throw new LexicalError(
                `Invalid character escape sequence: \\u${invalidSequence}.`,
                line,
                col + (position - start),
                lexer.source
              )
            }
            value += String.fromCharCode(charCode)
            position += 4
            break
          }
          default:
            throw new LexicalError(
              `Invalid character escape sequence: \\${String.fromCharCode(
                code
              )}.`,
              line,
              col + (position - start),
              lexer.source
            )
        }
        ++position
        chunkStart = position
      }
    }

    throw new LexicalError(
      'Unterminated string.',
      line,
      col + (position - start),
      lexer.source
    )
  }

  const readNumber = (
    start: number,
    firstCode: number,
    line: number,
    col: number,
    prev: Token | null
  ): NumberLiteral => {
    const content = lexer.source.content
    let code = firstCode
    let position = start

    if (code === 45) {
      // -
      code = content.charCodeAt(++position)
    }

    if (code === 48) {
      // 0
      code = content.charCodeAt(++position)
      if (code >= 48 && code <= 57) {
        throw new LexicalError(
          `Invalid number, unexpected digit after 0: ${printCharCode(code)}.`,
          line,
          col + (position - start),
          lexer.source
        )
      }
    } else {
      position = readDigits(position, code)
      code = content.charCodeAt(position)
    }

    if (code === 46) {
      // .
      code = content.charCodeAt(++position)
      position = readDigits(position, code)
      code = content.charCodeAt(position)
    }

    if (code === 69 || code === 101) {
      // E e
      code = content.charCodeAt(++position)
      if (code === 43 || code === 45) {
        // + -
        code = content.charCodeAt(++position)
      }
      position = readDigits(position, code)
      code = content.charCodeAt(position)
    }

    if (code === 46 || isNameStart(code)) {
      throw new LexicalError(
        `Invalid number, expected digit but got: ${printCharCode(code)}.`,
        lexer.line,
        position - lexer.lineStart,
        lexer.source
      )
    }

    return createToken(
      TokenKind.NUMBER,
      content.slice(start, position),
      start,
      position,
      line,
      col,
      prev
    )
  }

  const readDigits = (start: number, firstCode: number): number => {
    const content = lexer.source.content
    let position = start
    let code = firstCode
    if (code >= 48 && code <= 57) {
      // 0 - 9
      do {
        code = content.charCodeAt(++position)
      } while (code >= 48 && code <= 57) // 0 - 9
      return position
    }
    throw new LexicalError(
      `Invalid number, expected digit but got: ${printCharCode(code)}.`,
      lexer.line,
      position - lexer.lineStart,
      lexer.source
    )
  }

  const readName = (
    start: number,
    line: number,
    col: number,
    prev: Token | null
  ): Name | PrimitiveType | SpecialType | BooleanLiteral | Keyword => {
    const content = lexer.source.content

    // keyword
    for (let value of Object.values(KeywordEnum)) {
      if (content.slice(start, start + value.length) === value) {
        return createToken(
          TokenKind.KEYWORD,
          value,
          start,
          start + value.length,
          line,
          col,
          prev
        )
      }
    }

    // primitive
    for (let value of Object.values(PrimitiveTypeEnum)) {
      if (content.slice(start, start + value.length) === value) {
        return createToken(
          TokenKind.PRIMITIVETYPE,
          value,
          start,
          start + value.length,
          line,
          col,
          prev
        )
      }
    }

    // primitive
    for (let value of Object.values(SpecialTypeEnum)) {
      if (content.slice(start, start + value.length) === value) {
        return createToken(
          TokenKind.SPECIALTYPE,
          value,
          start,
          start + value.length,
          line,
          col,
          prev
        )
      }
    }

    // boolean
    for (let value of Object.values(BooleanEnum)) {
      if (content.slice(start, start + value.length) === value) {
        return createToken(
          TokenKind.BOOLEAN,
          value,
          start,
          start + value.length,
          line,
          col,
          prev
        )
      }
    }

    let position = start + 1
    let code = 0
    while (
      position !== length &&
      !isNaN((code = content.charCodeAt(position))) &&
      (code === 95 || // _
        (code >= 48 && code <= 57) || // 0-9
        (code >= 65 && code <= 90) || // A-Z
        (code >= 97 && code <= 122)) // a-z
    ) {
      ++position
    }
    return createToken(
      TokenKind.NAME,
      content.slice(start, position),
      start,
      position,
      line,
      col,
      prev
    )
  }

  return lexer
}

function printCharCode(code: number): string {
  return (
    // NaN/undefined represents access beyond the end of the file.
    isNaN(code)
      ? TokenKind.EOF
      : // Trust JSON for ASCII.
      code < 0x007f
      ? JSON.stringify(String.fromCharCode(code))
      : // Otherwise print the escaped form.
        `"\\u${('00' + code.toString(16).toUpperCase()).slice(-4)}"`
  )
}

// _ A-Z a-z
function isNameStart(code: number): boolean {
  return (
    code === 95 || (code >= 65 && code <= 90) || (code >= 97 && code <= 122)
  )
}

function uniCharCode(a: number, b: number, c: number, d: number): number {
  return (
    (char2hex(a) << 12) | (char2hex(b) << 8) | (char2hex(c) << 4) | char2hex(d)
  )
}

function char2hex(a: number): number {
  return a >= 48 && a <= 57
    ? a - 48 // 0-9
    : a >= 65 && a <= 70
    ? a - 55 // A-F
    : a >= 97 && a <= 102
    ? a - 87 // a-f
    : -1
}
