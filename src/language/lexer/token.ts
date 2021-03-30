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
  call                  =         'call',
  Import                =         'import',
  From                  =         'from',
  Call                  =         'call',
  Derive                =         'derive',
}

// prettier-ignore
export enum BooleanEnum {
  True                  =         'true',
  False                 =         'false',
}

export const Null = 'null' as const
export type Null = typeof Null

// prettier-ignore
export enum TokenKind {
  COMMENT               =         'comment',
  OPERATOR              =         'operator',
  KEYWORD               =         'keyword',
  STRING                =         'string',
  NUMBER                =         'number',
  NULL                  =         'null',
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

export interface NullLiteral extends BaseToken {
  kind: TokenKind.NULL
  word: Null
}

export interface BooleanLiteral extends BaseToken {
  kind: TokenKind.NULL
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
  | Operator
  | Name
  | StringLiteral
  | NumberLiteral
  | NullLiteral
  | BooleanLiteral
  | SOF
  | EOF

export function createToken (
  kind: TokenKind.COMMENT,
  word: string,
  start: number,
  end: number,
  line: number,
  column: number,
  prev: Token | null,
): Comment
export function createToken (
  kind: TokenKind.OPERATOR,
  word: OperatorEnum,
  start: number,
  end: number,
  line: number,
  column: number,
  prev: Token | null,
): Operator
export function createToken (
  kind: TokenKind.KEYWORD,
  word: KeywordEnum,
  start: number,
  end: number,
  line: number,
  column: number,
  prev: Token | null,
): Keyword
export function createToken (
  kind: TokenKind.STRING,
  word: string,
  start: number,
  end: number,
  line: number,
  column: number,
  prev: Token | null,
): StringLiteral
export function createToken (
  kind: TokenKind.NUMBER,
  word: string,
  start: number,
  end: number,
  line: number,
  column: number,
  prev: Token | null,
): NumberLiteral
export function createToken (
  kind: TokenKind.NULL,
  word: Null,
  start: number,
  end: number,
  line: number,
  column: number,
  prev: Token | null,
): NullLiteral
export function createToken (
  kind: TokenKind.BOOLEAN,
  word: BooleanEnum,
  start: number,
  end: number,
  line: number,
  column: number,
  prev: Token | null,
): BooleanLiteral
export function createToken (
  kind: TokenKind.NAME,
  word: string,
  start: number,
  end: number,
  line: number,
  column: number,
  prev: Token | null,
): Name
export function createToken (
  kind: TokenKind.SOF,
  word: void,
  start: number,
  end: number,
  line: number,
  column: number,
  prev: Token | null,
): SOF
export function createToken (
  kind: TokenKind.EOF,
  word: void,
  start: number,
  end: number,
  line: number,
  column: number,
  prev: Token | null,
): EOF
export function createToken (
  kind: TokenKind,
  word: string | void,
  start: number,
  end: number,
  line: number,
  column: number,
  prev: Token | null,
): Token {
  const token = {
    kind,
    word,
    range: createRange(start, end, line, column),
    prev,
    next: null
  } as Token

  if (prev) {
    prev.next = token
  }

  return token
}
