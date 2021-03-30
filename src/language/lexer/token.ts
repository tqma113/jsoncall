import { createRange, Range } from '../range'

// prettier-ignore
export enum OperatorEnum {
  OpenBrace             =         '{',
  CloseBrace            =         '}',
  OpenBracket           =         '[',
  CloseBracket          =         ']',
  OpenParen             =         '(',
  CloseParen            =         ')',

  Union                 =         '|',
  Intersect             =         '&',
  Assign                =         '=',
  Output                =         '=>',
  Comma                 =         ',',
  Colon                 =         ':',
}

// prettier-ignore
export enum KeywordEnum {
  Type                  =         'type',
  Call                  =         'call',
  Derive                =         'derive',
  From                  =         'from',
  Import                =         'import',
  Export                =         'export',
  As                    =         'as',
}

// prettier-ignore
export enum PrimitiveTypeEnum {
  Number                =         'number',
  String                =         'string',
  Null                  =         'null',
  Boolean               =         'boolean',
}

// prettier-ignore
export enum SpecialTypeEnum {
  Any                   =         'any',
  None                  =         'none',
}

// prettier-ignore
export enum BooleanEnum {
  True                  =         'true',
  False                 =         'false',
}

// prettier-ignore
export enum TokenKind {
  COMMENT               =         'comment',
  OPERATOR              =         'operator',
  KEYWORD               =         'keyword',
  PRIMITIVETYPE         =         'primitivetype',
  SPECIALTYPE           =         'specialtype',
  STRING                =         'string',
  NUMBER                =         'number',
  BOOLEAN               =         'boolean',
  NAME                  =         'name',
  SOF                   =         '<SOF>',
  EOF                   =         '<EOF>',
}

export interface BaseToken {
  kind: TokenKind
  word: string | void
  range: Range

  prev: Token | null
  next: Token | null
}

export interface Comment extends BaseToken {
  kind: TokenKind.COMMENT
}

export interface Keyword extends BaseToken {
  kind: TokenKind.KEYWORD
  word: KeywordEnum
}

export interface Operator extends BaseToken {
  kind: TokenKind.OPERATOR
  word: OperatorEnum
}

export interface StringLiteral extends BaseToken {
  kind: TokenKind.STRING
}

export interface NumberLiteral extends BaseToken {
  kind: TokenKind.NUMBER
}

export interface PrimitiveType extends BaseToken {
  kind: TokenKind.PRIMITIVETYPE
  word: PrimitiveTypeEnum
}

export interface SpecialType extends BaseToken {
  kind: TokenKind.SPECIALTYPE
  word: PrimitiveTypeEnum
}

export interface BooleanLiteral extends BaseToken {
  kind: TokenKind.BOOLEAN
  word: BooleanEnum
}

export interface Name extends BaseToken {
  kind: TokenKind.NAME
  word: string
}

export interface SOF extends BaseToken {
  kind: TokenKind.SOF
  word: void
}

export interface EOF extends BaseToken {
  kind: TokenKind.EOF
  word: void
}

export type Token =
  | Comment
  | Keyword
  | PrimitiveType
  | SpecialType
  | Operator
  | Name
  | StringLiteral
  | NumberLiteral
  | BooleanLiteral
  | SOF
  | EOF

export function createToken(
  kind: TokenKind.COMMENT,
  word: string,
  start: number,
  end: number,
  line: number,
  column: number,
  prev: Token | null
): Comment
export function createToken(
  kind: TokenKind.OPERATOR,
  word: OperatorEnum,
  start: number,
  end: number,
  line: number,
  column: number,
  prev: Token | null
): Operator
export function createToken(
  kind: TokenKind.KEYWORD,
  word: KeywordEnum,
  start: number,
  end: number,
  line: number,
  column: number,
  prev: Token | null
): Keyword
export function createToken(
  kind: TokenKind.PRIMITIVETYPE,
  word: PrimitiveTypeEnum,
  start: number,
  end: number,
  line: number,
  column: number,
  prev: Token | null
): PrimitiveType
export function createToken(
  kind: TokenKind.SPECIALTYPE,
  word: SpecialTypeEnum,
  start: number,
  end: number,
  line: number,
  column: number,
  prev: Token | null
): SpecialType
export function createToken(
  kind: TokenKind.STRING,
  word: string,
  start: number,
  end: number,
  line: number,
  column: number,
  prev: Token | null
): StringLiteral
export function createToken(
  kind: TokenKind.NUMBER,
  word: string,
  start: number,
  end: number,
  line: number,
  column: number,
  prev: Token | null
): NumberLiteral
export function createToken(
  kind: TokenKind.BOOLEAN,
  word: BooleanEnum,
  start: number,
  end: number,
  line: number,
  column: number,
  prev: Token | null
): BooleanLiteral
export function createToken(
  kind: TokenKind.NAME,
  word: string,
  start: number,
  end: number,
  line: number,
  column: number,
  prev: Token | null
): Name
export function createToken(
  kind: TokenKind.SOF,
  word: void,
  start: number,
  end: number,
  line: number,
  column: number,
  prev: Token | null
): SOF
export function createToken(
  kind: TokenKind.EOF,
  word: void,
  start: number,
  end: number,
  line: number,
  column: number,
  prev: Token | null
): EOF
export function createToken(
  kind: TokenKind,
  word: string | void,
  start: number,
  end: number,
  line: number,
  column: number,
  prev: Token | null
): Token {
  const range = createRange(start, end, line, column)
  const token = {
    kind,
    word,
    range,
    prev,
    next: null,
    toJSON: () => ({
      kind,
      word,
      range,
    })
  } as Token

  if (prev) {
    prev.next = token
  }

  return token
}
