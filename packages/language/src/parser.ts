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
  TypeNode,
  ListTypeNode,
  ObjectTypeNode,
  TupleTypeNode,
  RecordTypeNode,
  PrimitiveTypeNode,
  SpecialTypeNode,
  StringLiteralNode,
  NumberLiteralNode,
  BooleanLiteralNode,
  createTypeDeclaration,
  createDeriveDeclaration,
  createCallDeclaration,
  createUnionNode,
  createIntersectionNode,
  createListTypeNode,
  createTupleTypeNode,
  createRecordTypeNode,
  createPrimitiveTypeNode,
  createSpecialTypeNode,
  createStringLiteralNode,
  createNumberLiteralNode,
  createBooleanLiteralNode,
  createObjectTypeNode,
  createObjectFieldNode,
  ObjectFieldNode,
  CommentBlock,
  createCommentBlock,
} from './ast'
import { Lexer, createLexer } from './lexer'
import { SyntaxError } from './error'
import {
  KeywordEnum,
  Token,
  TokenKind,
  Keyword,
  OperatorEnum,
  Operator,
  Comment,
} from './token'
import type { Source } from './source'

export type Parser = {
  source: Source

  lexer: Lexer

  expectToken: <K extends TokenKind, T = TokenType<Token, K>>(kind: K) => T

  parseDocument: () => Document
  parseStatement: () => Statement
  parseTypeDeclaration: (comment?: CommentBlock) => TypeDeclaration
  parseDeriveDeclaration: (comment?: CommentBlock) => DeriveDeclaration
  parseCallDeclaration: (comment?: CommentBlock) => CallDeclaration
  parseNameNode: () => NameNode
  parseTypeNode: () => TypeNode
  parseSimpleTypeNode: () => TypeNode | null
  parseListTypeNode: () => ListTypeNode
  parseObjectTypeNode: () => ObjectTypeNode
  parseTupleTypeNode: () => TupleTypeNode
  parseRecordTypeNode: () => RecordTypeNode
  parsePrimitiveTypeNode: () => PrimitiveTypeNode
  parseSpecialTypeNode: () => SpecialTypeNode
  parseStringLiteralNode: () => StringLiteralNode
  parseNumberLiteralNode: () => NumberLiteralNode
  parseBooleanLiteralNode: () => BooleanLiteralNode
  parseCommentBlock: () => CommentBlock
}

type TokenType<T extends Token, K extends TokenKind> = T extends { kind: K }
  ? T
  : never

export const createParser = (source: Source): Parser => {
  const lexer = createLexer(source)

  const loc = (startToken: Token): Location => {
    return createLocation(startToken, lexer.lastToken, source)
  }

  const peek = (kind: TokenKind): boolean => {
    return lexer.token.kind === kind
  }

  const expectToken = <K extends TokenKind, T = TokenType<Token, K>>(
    kind: K
  ): T => {
    const token = lexer.token
    if (token.kind === kind) {
      lexer.next()
      return token as any as T
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
      return token as any as T
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
      ),
      loc(start)
    )
  }

  const parseStatement = (): Statement => {
    const comment = parseCommentBlock()
    if (peek(TokenKind.KEYWORD)) {
      const token = lexer.token as Keyword
      switch (token.word) {
        case KeywordEnum.Type:
          return parseTypeDeclaration(comment)
        case KeywordEnum.Derive:
          return parseDeriveDeclaration(comment)
        case KeywordEnum.Call:
          return parseCallDeclaration(comment)
      }
    }

    throw unexpected()
  }

  const parseTypeDeclaration = (
    comment: CommentBlock = createCommentBlock()
  ): TypeDeclaration => {
    const start = lexer.token

    expectKeyword(KeywordEnum.Type)

    const name = parseNameNode()

    expectOperator(OperatorEnum.Assign)
    return createTypeDeclaration(name, parseTypeNode(), comment, loc(start))
  }

  const parseDeriveDeclaration = (
    comment: CommentBlock = createCommentBlock()
  ): DeriveDeclaration => {
    const start = lexer.token

    expectKeyword(KeywordEnum.Derive)

    const name = parseNameNode()

    expectKeyword(KeywordEnum.From)
    return createDeriveDeclaration(name, parseTypeNode(), comment, loc(start))
  }

  const parseCallDeclaration = (
    comment: CommentBlock = createCommentBlock()
  ): CallDeclaration => {
    const start = lexer.token

    expectKeyword(KeywordEnum.Call)

    const name = parseNameNode()

    expectOperator(OperatorEnum.Colon)

    const input = parseTypeNode()

    expectOperator(OperatorEnum.Output)

    return createCallDeclaration(
      name,
      input,
      parseTypeNode(),
      comment,
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
      if (expectOptionalOperator(OperatorEnum.Union)) {
        return createUnionNode(
          [
            node,
            ...delimitedMany(
              shouldOptionalOperator(OperatorEnum.Union),
              parseTypeNode
            ),
          ],
          loc(start)
        )
      } else if (expectOptionalOperator(OperatorEnum.Intersect)) {
        return createIntersectionNode(
          [
            node,
            ...delimitedMany(
              shouldOptionalOperator(OperatorEnum.Intersect),
              parseTypeNode
            ),
          ],
          loc(start)
        )
      }

      return node
    }
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
          case OperatorEnum.OpenAngle:
            return parseRecordTypeNode()
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

  const parseObjectTypeField = (): ObjectFieldNode => {
    const comment = parseCommentBlock()
    const start = lexer.token

    const name = parseNameNode()

    expectOperator(OperatorEnum.Colon)

    const node = parseTypeNode()

    expectOptionalOperator(OperatorEnum.Comma)

    return createObjectFieldNode(name, node, comment, loc(start))
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

  const parseRecordTypeNode = (): RecordTypeNode => {
    const start = lexer.token

    expectOperator(OperatorEnum.OpenAngle)
    const node = parseTypeNode()
    expectOperator(OperatorEnum.CloseAngle)

    return createRecordTypeNode(node, loc(start))
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

  const parseCommentBlock = (): CommentBlock => {
    const start = lexer.token

    let cur: Token = start
    const comments: Comment[] = []
    while (cur.kind === TokenKind.COMMENT) {
      comments.push(cur)
      expectToken(TokenKind.COMMENT)
      cur = lexer.token
    }

    if (comments.length > 0) {
      return createCommentBlock(comments, loc(start))
    } else {
      return createCommentBlock()
    }
  }

  const parser: Parser = {
    source,
    lexer,

    expectToken,

    parseDocument,
    parseStatement,
    parseTypeDeclaration,
    parseDeriveDeclaration,
    parseCallDeclaration,
    parseNameNode,
    parseTypeNode,
    parseSimpleTypeNode,
    parseListTypeNode,
    parseObjectTypeNode,
    parseTupleTypeNode,
    parseRecordTypeNode,
    parsePrimitiveTypeNode,
    parseSpecialTypeNode,
    parseStringLiteralNode,
    parseNumberLiteralNode,
    parseBooleanLiteralNode,
    parseCommentBlock,
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
