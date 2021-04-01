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
  TypeNode,
  PathNode,
  ListTypeNode,
  ObjectTypeNode,
  TupleTypeNode,
  PrimitiveTypeNode,
  SpecialTypeNode,
  StringLiteralNode,
  NumberLiteralNode,
  BooleanLiteralNode,
  createTypeDeclaration,
  createDeriveDeclaration,
  createCallDeclaration,
  createImportStatement,
  createExportStatement,
  createUnionNode,
  createIntersectionNode,
  createListTypeNode,
  createTupleTypeNode,
  createPrimitiveTypeNode,
  createSpecialTypeNode,
  createStringLiteralNode,
  createNumberLiteralNode,
  createBooleanLiteralNode,
  createObjectTypeNode,
  createPathNode,
  ASTNodeKind,
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
  Operator,
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

  const expectOptionalKeyword = (word: KeywordEnum): boolean => {
    const token = lexer.token
    if (token.kind === TokenKind.KEYWORD && token.word === word) {
      lexer.next()
      return true
    }
    return false
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
    shouldStart: () => any,
    parseFn: () => T,
    shouldStop: () => boolean
  ): Array<T> => {
    shouldStart()
    const nodes = []
    while (!shouldStop()) {
      nodes.push(parseFn.call(this))
    }
    return nodes
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
      any(
        shouldToken(TokenKind.SOF),
        parseStatement,
        shouldOptionalToken(TokenKind.EOF)
      ).sort((a, b) => getStatementValue(a) - getStatementValue(b)),
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

    const names = any(
      shouldOperator(OperatorEnum.OpenBrace),
      parseImportName,
      shouldOptionalOperator(OperatorEnum.CloseBrace)
    )

    expectKeyword(KeywordEnum.From)
    return createImportStatement(names, parsePathNode(), loc(start))
  }

  const parsePathNode = (): PathNode => {
    const token = expectToken(TokenKind.STRING)
    return createPathNode(token, loc(token))
  }

  const parseImportName = (): [NameNode, NameNode] => {
    const name = parseNameNode()
    if (expectOptionalKeyword(KeywordEnum.As)) {
      const asName = expectToken(TokenKind.NAME)
      return [name, createNameNode(asName, loc(asName))]
    } else {
      return [name, name]
    }
  }

  const parseExportStatement = (): ExportStatement => {
    const start = lexer.token

    expectKeyword(KeywordEnum.Export)

    return createExportStatement(
      any(
        shouldOperator(OperatorEnum.OpenBrace),
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
    const start = lexer.token
    let node = parseSimpleTypeNode()

    if (node === null) {
      throw unexpected()
    } else {
      const token = lexer.token
      if (token.kind === TokenKind.OPERATOR) {
        if (token.word === OperatorEnum.Union) {
          return createUnionNode([node, ...parseUnionRest()], loc(start))
        } else if (token.word === OperatorEnum.Intersect) {
          return createIntersectionNode(
            [node, ...parseIntersectRest()],
            loc(start)
          )
        }
      }

      return node
    }
  }

  const parseUnionRest = (): TypeNode[] => {
    expectOperator(OperatorEnum.Union)

    return [
      parseTypeNode(),
      ...delimitedMany(
        shouldOptionalOperator(OperatorEnum.Union),
        parseTypeNode
      ),
    ]
  }

  const parseIntersectRest = (): TypeNode[] => {
    expectOperator(OperatorEnum.Intersect)

    return [
      parseTypeNode(),
      ...delimitedMany(
        shouldOptionalOperator(OperatorEnum.Intersect),
        parseTypeNode
      ),
    ]
  }

  // PrimitiveTypeNode SpecialTypeNode ListTypeNode ObjectTypeNode TupleTypeNode
  // StringLiteralNode NumberLiteralNode BooleanLiteralNode NameNode
  const parseSimpleTypeNode = (): TypeNode | null => {
    switch (lexer.token.kind) {
      case TokenKind.OPERATOR: {
        const token = lexer.token as Operator

        switch (token.word) {
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

    return null
  }

  const parseListTypeNode = (): ListTypeNode => {
    const start = lexer.token

    expectOperator(OperatorEnum.OpenBracket)
    const node = parseTypeNode()
    expectOperator(OperatorEnum.CloseBracket)

    return createListTypeNode(node, loc(start))
  }

  const parseObjectTypeNode = (): ObjectTypeNode => {
    const start = lexer.token

    return createObjectTypeNode(
      many(
        shouldOperator(OperatorEnum.OpenBrace),
        parseObjectTypeField,
        shouldOptionalOperator(OperatorEnum.CloseBrace)
      ),
      loc(start)
    )
  }

  const parseObjectTypeField = (): [NameNode, TypeNode] => {
    const name = parseNameNode()

    expectOperator(OperatorEnum.Colon)

    const node = parseTypeNode()

    expectOptionalOperator(OperatorEnum.Comma)

    return [name, node]
  }

  const parseTupleTypeNode = (): TupleTypeNode => {
    const start = lexer.token

    return createTupleTypeNode(
      many(
        shouldOperator(OperatorEnum.OpenParen),
        parseTupleItem,
        shouldOptionalOperator(OperatorEnum.CloseParen)
      ),
      loc(start)
    )
  }

  const parseTupleItem = (): TypeNode => {
    const node = parseTypeNode()

    expectOptionalOperator(OperatorEnum.Comma)

    return node
  }

  const parsePrimitiveTypeNode = (): PrimitiveTypeNode => {
    const token = expectToken(TokenKind.PRIMITIVETYPE)
    return createPrimitiveTypeNode(token, loc(token))
  }

  const parseSpecialTypeNode = (): SpecialTypeNode => {
    const token = expectToken(TokenKind.SPECIALTYPE)
    return createSpecialTypeNode(token, loc(token))
  }

  const parseStringLiteralNode = (): StringLiteralNode => {
    const token = expectToken(TokenKind.STRING)
    return createStringLiteralNode(token, loc(token))
  }

  const parseNumberLiteralNode = (): NumberLiteralNode => {
    const token = expectToken(TokenKind.NUMBER)
    return createNumberLiteralNode(token, loc(token))
  }

  const parseBooleanLiteralNode = (): BooleanLiteralNode => {
    const token = expectToken(TokenKind.BOOLEAN)
    return createBooleanLiteralNode(token, loc(token))
  }

  const parser: Parser = {
    source,
    lexer,
    parseDocument,
  }

  return parser
}

export const parse = (source: Source): Document => {
  const parser = createParser(source)
  return parser.parseDocument()
}

function getTokenDesc(token: Token): string {
  const value = token.word
  return token.kind + (value != null ? ` "${value}"` : '')
}

function getStatementValue(statement: Statement) {
  switch (statement.kind) {
    case ASTNodeKind.TypeDeclaration:
      return 2
    case ASTNodeKind.DeriveDeclaration:
      return 1
    case ASTNodeKind.CallDeclaration:
      return 0
    case ASTNodeKind.ExportStatement:
      return -1
    case ASTNodeKind.ImportStatement:
      return 3
  }
}
