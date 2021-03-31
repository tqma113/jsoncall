import {
  Document,
  Location,
  Statement,
  NameNode,
  createLocation,
  createDocument,
  createNameNode,
  TypeDeclaration,
  DeriveDeclaration,
  CallDeclaration,
  ImportStatement,
  ExportStatement,
  createTypeDeclaration,
  TypeNode,
  createDeriveDeclaration,
  createCallDeclaration,
  createImportStatement,
  PathNode,
  createPathNode,
  createExportStatement,
  ListTypeNode,
  ObjectTypeNode,
  TupleTypeNode,
  PrimitiveTypeNode,
  SpecialTypeNode,
  StringLiteralNode,
  NumberLiteralNode,
  BooleanLiteralNode
} from './ast'
import { Lexer, createLexer } from './lexer'
import { SyntaxError } from './error'
import { Source } from './source'
import {
  KeywordEnum,
  Token,
  TokenKind,
  Keyword,
  OperatorEnum,
  Operator
} from './token'

export type Parser = {
  source: Source

  lexer: Lexer

  parseDocument: () => Document
}

export const createParser = (source: Source): Parser => {
  const lexer = createLexer(source)

  const loc = (startToken: Token): Location => {
    return createLocation(startToken, lexer.lastToken, source)
  }

  const peek = (kind: TokenKind): boolean => {
    return lexer.token.kind === kind
  }

  type TokenType<T extends Token, K extends TokenKind> = T extends { kind: K }
    ? T
    : never

  const expectToken = <K extends TokenKind, T = TokenType<Token, K>>(
    kind: K
  ): T => {
    const token = lexer.token
    if (token.kind === kind) {
      lexer.next()
      return (token as any) as T
    }

    throw new SyntaxError(
      `Expected ${kind}, found ${getTokenDesc(token)}.`,
      token,
      source
    )
  }

  const expectOptionalToken = <K extends TokenKind, T = TokenType<Token, K>>(
    kind: K
  ): T | null => {
    const token = lexer.token
    if (token.kind === kind) {
      lexer.next()
      return (token as any) as T
    }
    return null
  }

  const expectKeyword = (word: KeywordEnum) => {
    const token = lexer.token
    if (token.kind === TokenKind.KEYWORD && token.word === word) {
      lexer.next()
    } else {
      throw new SyntaxError(
        `Expected "${word}", found ${getTokenDesc(token)}.`,
        token,
        lexer.source
      )
    }
  }

  const expectOperator = (word: OperatorEnum) => {
    const token = lexer.token
    if (token.kind === TokenKind.OPERATOR && token.word === word) {
      lexer.next()
    } else {
      throw new SyntaxError(
        `Expected "${word}", found ${getTokenDesc(token)}.`,
        token,
        lexer.source
      )
    }
  }

  const expectOptionalOperator = (word: OperatorEnum): boolean => {
    const token = lexer.token
    if (token.kind === TokenKind.OPERATOR && token.word === word) {
      lexer.next()
      return true
    }
    return false
  }

  const unexpected = (token: Token = lexer.token): SyntaxError => {
    return new SyntaxError(
      `Unexpected ${getTokenDesc(token)}.`,
      token,
      lexer.source
    )
  }

  const any = <T>(
    openKind: TokenKind,
    parseFn: () => T,
    closeKind: TokenKind
  ): Array<T> => {
    expectToken(openKind)
    const nodes = []
    while (!expectOptionalToken(closeKind)) {
      nodes.push(parseFn.call(this))
    }
    return nodes
  }

  const optionalMany = <T>(
    shouldStart: () => boolean,
    parseFn: () => T,
    shouldStop: () => boolean
  ): Array<T> => {
    if (shouldStart()) {
      const nodes = []
      do {
        nodes.push(parseFn.call(this))
      } while (!shouldStop())
      return nodes
    }
    return []
  }

  const many = <T>(
    start: () => any,
    parseFn: () => T,
    shouldStop: () => boolean
  ): Array<T> => {
    start()
    const nodes = []
    do {
      nodes.push(parseFn.call(this))
    } while (!shouldStop())
    return nodes
  }

  const delimitedMany = <T>(
    shouldDelimit: () => boolean,
    parseFn: () => T
  ): Array<T> => {
    shouldDelimit()

    const nodes = []
    do {
      nodes.push(parseFn.call(this))
    } while (shouldDelimit())
    return nodes
  }

  const shouldToken = (kind: TokenKind) => () => {
    expectToken(kind)
  }

  const shouldOptionalToken = (kind: TokenKind) => () => {
    return !!expectOptionalToken(kind)
  }

  const shouldOperator = (kind: OperatorEnum) => () => {
    expectOperator(kind)
  }

  const shouldOptionalOperator = (kind: OperatorEnum) => () => {
    return !!expectOptionalOperator(kind)
  }

  const parseDocument = (): Document => {
    const start = lexer.token
    return createDocument(
      many(
        shouldToken(TokenKind.SOF),
        parseStatement,
        shouldOptionalToken(TokenKind.EOF)
      ),
      loc(start)
    )
  }

  const parseStatement = (): Statement => {
    if (peek(TokenKind.KEYWORD)) {
      const token = lexer.token as Keyword
      switch (token.word) {
        case KeywordEnum.Type:
          return parseTypeDeclaration()
        case KeywordEnum.Derive:
          return parseDeriveDeclaration()
        case KeywordEnum.Call:
          return parseCallDeclaration()
        case KeywordEnum.Import:
          return parseImportStatement()
        case KeywordEnum.Export:
          return parseExportStatement()
      }
    }

    throw unexpected()
  }

  const parseTypeDeclaration = (): TypeDeclaration => {
    const start = lexer.token
    const name = parseNameNode()

    expectOperator(OperatorEnum.Assign)
    return createTypeDeclaration(name, parseTypeNode(), loc(start))
  }

  const parseDeriveDeclaration = (): DeriveDeclaration => {
    const start = lexer.token
    const name = parseNameNode()

    expectKeyword(KeywordEnum.From)
    return createDeriveDeclaration(name, parseTypeNode(), loc(start))
  }

  const parseCallDeclaration = (): CallDeclaration => {
    const start = lexer.token
    const name = parseNameNode()

    expectOperator(OperatorEnum.Colon)

    const input = parseTypeNode()

    expectOperator(OperatorEnum.Output)

    return createCallDeclaration(name, input, parseTypeNode(), loc(start))
  }

  const parseImportStatement = (): ImportStatement => {
    const start = lexer.token

    expectKeyword(KeywordEnum.Import)

    const names = many(
      shouldOperator(OperatorEnum.OpenBrace),
      parseImportName,
      shouldOptionalOperator(OperatorEnum.CloseBrace),
    )

    expectKeyword(KeywordEnum.From)
    return createImportStatement(names, parsePathNode(), loc(start))
  }

  const parsePathNode = (): PathNode => {
    const token = expectToken(TokenKind.STRING)
    return createPathNode(token, loc(token))
  }

  const parseImportName = (): [NameNode, NameNode] => {
    const field = parseNameNode()
    const asField = expectOptionalToken(TokenKind.NAME)
    if (asField === null) {
        return [field, field]
    } else {
      return [field, createNameNode(asField, loc(asField))]
    }
  }

  const parseExportStatement = (): ExportStatement => {
    const start = lexer.token

    expectKeyword(KeywordEnum.Export)

    return createExportStatement(
      optionalMany(
        shouldOptionalOperator(OperatorEnum.OpenBrace),
        parseExportField,
        shouldOptionalOperator(OperatorEnum.CloseBrace)
      ),
      loc(start)
    )
  }

  const parseExportField = (): NameNode => {
    const name = parseNameNode()
    expectOptionalOperator(OperatorEnum.Comma)
    return name
  }

  const parseNameNode = (): NameNode => {
    const token = expectToken(TokenKind.NAME)
    return createNameNode(token, loc(token))
  }

  const parseTypeNode = (): TypeNode => {
    let node = parseSimpleTypeNode()

    
  }

  // PrimitiveTypeNode SpecialTypeNode ListTypeNode ObjectTypeNode TupleTypeNode
  // StringLiteralNode NumberLiteralNode BooleanLiteralNode NameNode
  const parseSimpleTypeNode = (): TypeNode => {
    const start = lexer.token

    switch(start.kind) {
      case TokenKind.OPERATOR: {
        const token = lexer.token as Operator

        switch(token.word) {
          case OperatorEnum.OpenBracket:
            return parseListTypeNode()
          case OperatorEnum.OpenBrace:
            return parseObjectTypeNode()
          case OperatorEnum.OpenParen:
            return parseTupleTypeNode()
        }

        break
      }
      case TokenKind.PRIMITIVETYPE: {
        return parsePrimitiveTypeNode()
      }
      case TokenKind.SPECIALTYPE: {
        return parseSpecialTypeNode()
      }
      case TokenKind.STRING: {
        return parseStringLiteralNode()
      }
      case TokenKind.NUMBER: {
        return parseNumberLiteralNode()
      }
      case TokenKind.BOOLEAN: {
        return parseBooleanLiteralNode()
      }
      case TokenKind.NAME: {
        return parseNameNode()
      }
    }

    throw unexpected()
  }

  const parseListTypeNode = (): ListTypeNode => {

  }

  const parseObjectTypeNode = (): ObjectTypeNode => {

  }

  const parseTupleTypeNode = (): TupleTypeNode => {

  }

  const parsePrimitiveTypeNode = (): PrimitiveTypeNode => {

  }

  const parseSpecialTypeNode = (): SpecialTypeNode => {

  }

  const parseStringLiteralNode = (): StringLiteralNode => {

  }

  const parseNumberLiteralNode = (): NumberLiteralNode => {

  }

  const parseBooleanLiteralNode = (): BooleanLiteralNode => {

  }

  const parser: Parser = {
    source,
    lexer,
    parseDocument
  }

  return parser
}

export const parse = (source: Source): Document => {
  const parser = createParser(source)
  return parser.parseDocument()
}

function getTokenDesc (token: Token): string {
  const value = token.word
  return token.kind + (value != null ? ` "${value}"` : '')
}
