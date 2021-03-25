export enum OperatorEnum {
  OpenBrace             =         '{',
  CloseBrace            =         '}',
  OpenBracket           =         '[',
  CloseBracket          =         ']',

  Union                 =         '|',
  Intersect             =         '&',
  Assign                =         '=',
  Output                =         '=>',
  Comma                 =         ',',
}

// prettier-ignore
export enum KeywordEnum {
  Type                  =         'type',
  RPC                   =         'rpc',
  Import                =         'import',
  From                  =         'from',
}


// prettier-ignore
export enum TokenKind {
  Comment               =         'comment',
  Operator              =         'operator',
  Keyword               =         'keyword',
  Literal               =         'literal',
  Identifier            =         'identifier',
  SOF                   =         '<SOF>',
  EOF                   =         '<EOF>',
}

export interface BaseToken {
  kind: TokenKind
  word: string
  range: Range
}

export interface Keyword extends BaseToken {
  kind: TokenKind.Keyword
  word: KeywordEnum
}

export const createKeyword = (word: KeywordEnum, range: Range): Keyword => {
  return {
    kind: TokenKind.Keyword,
    word,
    range,
  }
}

export interface Operator extends BaseToken {
  kind: TokenKind.Operator
  word: OperatorEnum
}

export const createOperator = (word: OperatorEnum, range: Range): Operator => {
  return {
    kind: TokenKind.Operator,
    word,
    range,
  }
}

export interface Identifier extends BaseToken {
  kind: TokenKind.Identifier
  word: string
}

export const createIdentifier = (word: string, range: Range): Identifier => {
  return {
    kind: TokenKind.Identifier,
    word,
    range,
  }
}