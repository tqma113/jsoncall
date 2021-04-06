import fs from 'fs'
import path from 'path'
import { parse, createParser, TokenKind } from '../src'

describe('parser', () => {
  it('sample', () => {
    const moduleId = path.resolve(__dirname, './fixtures/base.jc')
    const content = fs.readFileSync(moduleId, 'utf-8')

    const document = parse({ moduleId, content })

    expect(document.statements.length).toBe(20)
  })

  describe('base', () => {
    it('parseBooleanLiteralNode', () => {
      const moduleId = 'parseBooleanLiteralNode.jc'
      const content = 'true false'

      const parser = createParser({ moduleId, content })
      parser.expectToken(TokenKind.SOF)

      expect(parser.parseBooleanLiteralNode()).toMatchObject({
        value: { kind: 'boolean', word: 'true' },
      })

      expect(parser.parseBooleanLiteralNode()).toMatchObject({
        value: { kind: 'boolean', word: 'false' },
      })
    })

    it('parseNumberLiteralNode', () => {
      const moduleId = 'parseNumberLiteralNode.jc'
      const content = '123'

      const parser = createParser({ moduleId, content })
      parser.expectToken(TokenKind.SOF)

      expect(parser.parseNumberLiteralNode()).toMatchObject({
        value: { kind: 'number', word: '123' },
      })
    })

    it('parseStringLiteralNode', () => {
      const moduleId = 'parseStringLiteralNode.jc'
      const content = '"foo"'

      const parser = createParser({ moduleId, content })
      parser.expectToken(TokenKind.SOF)

      expect(parser.parseStringLiteralNode()).toMatchObject({
        value: { kind: 'string', word: 'foo' },
      })
    })

    it('parseSpecialTypeNode', () => {
      const moduleId = 'parseSpecialTypeNode.jc'
      const content = 'any none'

      const parser = createParser({ moduleId, content })
      parser.expectToken(TokenKind.SOF)

      expect(parser.parseSpecialTypeNode()).toMatchObject({
        specialType: { kind: 'special type', word: 'any' },
      })

      expect(parser.parseSpecialTypeNode()).toMatchObject({
        specialType: { kind: 'special type', word: 'none' },
      })
    })

    it('parsePrimitiveTypeNode', () => {
      const moduleId = 'parsePrimitiveTypeNode.jc'
      const content = 'string number boolean null'

      const parser = createParser({ moduleId, content })
      parser.expectToken(TokenKind.SOF)

      expect(parser.parsePrimitiveTypeNode()).toMatchObject({
        primitiveType: { kind: 'primitive type', word: 'string' },
      })

      expect(parser.parsePrimitiveTypeNode()).toMatchObject({
        primitiveType: { kind: 'primitive type', word: 'number' },
      })

      expect(parser.parsePrimitiveTypeNode()).toMatchObject({
        primitiveType: { kind: 'primitive type', word: 'boolean' },
      })

      expect(parser.parsePrimitiveTypeNode()).toMatchObject({
        primitiveType: { kind: 'primitive type', word: 'null' },
      })
    })

    it('parseNameNode', () => {
      const moduleId = 'parseNameNode.jc'
      const content = 'foo'

      const parser = createParser({ moduleId, content })
      parser.expectToken(TokenKind.SOF)

      expect(parser.parseNameNode()).toMatchObject({
        name: { kind: 'name', word: 'foo' },
      })
    })

    it('parseCommentBlock', () => {
      const moduleId = 'parseCommentBlock.jc'
      const content = '# foo comment\n # bar comment'

      const parser = createParser({ moduleId, content })
      parser.expectToken(TokenKind.SOF)

      expect(parser.parseCommentBlock()).toMatchObject({
        comments: [
          { kind: 'comment', word: ' foo comment' },
          { kind: 'comment', word: ' bar comment' },
        ],
      })
    })

    it('parseTupleTypeNode', () => {
      const moduleId = 'parseTupleTypeNode.jc'
      const content = '(number, string)'

      const parser = createParser({ moduleId, content })
      parser.expectToken(TokenKind.SOF)

      expect(parser.parseTupleTypeNode()).toMatchObject({
        fields: [
          {
            primitiveType: { kind: 'primitive type', word: 'number' },
          },
          {
            primitiveType: { kind: 'primitive type', word: 'string' },
          },
        ],
      })
    })

    it('parseObjectTypeNode', () => {
      const moduleId = 'parseObjectTypeNode.jc'
      const content = '{ foo: number, bar: string }'

      const parser = createParser({ moduleId, content })
      parser.expectToken(TokenKind.SOF)

      expect(parser.parseObjectTypeNode()).toMatchObject({
        fields: [
          {
            name: { name: { kind: 'name', word: 'foo' } },
            type: {
              primitiveType: { kind: 'primitive type', word: 'number' },
            },
          },
          {
            name: { name: { kind: 'name', word: 'bar' } },
            type: {
              primitiveType: { kind: 'primitive type', word: 'string' },
            },
          },
        ],
      })
    })

    it('parseListTypeNode', () => {
      const moduleId = 'parseListTypeNode.jc'
      const content = '[string]'

      const parser = createParser({ moduleId, content })
      parser.expectToken(TokenKind.SOF)

      expect(parser.parseListTypeNode()).toMatchObject({
        type: {
          primitiveType: { kind: 'primitive type', word: 'string' },
        },
      })
    })

    it('parseTypeNode', () => {
      const moduleId = 'parseTypeNode.jc'
      const content = 'string | number string & number'

      const parser = createParser({ moduleId, content })
      parser.expectToken(TokenKind.SOF)

      expect(parser.parseTypeNode()).toMatchObject({
        kind: 'union type',
        types: [
          {
            primitiveType: { kind: 'primitive type', word: 'string' },
          },
          {
            primitiveType: { kind: 'primitive type', word: 'number' },
          },
        ],
      })

      expect(parser.parseTypeNode()).toMatchObject({
        kind: 'intersection type',
        types: [
          {
            primitiveType: { kind: 'primitive type', word: 'string' },
          },
          {
            primitiveType: { kind: 'primitive type', word: 'number' },
          },
        ],
      })
    })

    it('parseExportStatement', () => {
      const moduleId = 'parseExportStatement.jc'
      const content = 'export { foo, bar }'

      const parser = createParser({ moduleId, content })
      parser.expectToken(TokenKind.SOF)

      expect(parser.parseExportStatement()).toMatchObject({
        names: [
          {
            name: { kind: 'name', word: 'foo' },
          },
          {
            name: { kind: 'name', word: 'bar' },
          },
        ],
      })
    })

    it('parseImportStatement', () => {
      const moduleId = 'parseImportStatement.jc'
      const content = 'import { foo, bar as baz } from "./sample.jc"'

      const parser = createParser({ moduleId, content })
      parser.expectToken(TokenKind.SOF)

      expect(parser.parseImportStatement()).toMatchObject({
        names: [
          [
            {
              name: { kind: 'name', word: 'foo' },
            },
            {
              name: { kind: 'name', word: 'foo' },
            },
          ],
          [
            {
              name: { kind: 'name', word: 'bar' },
            },
            {
              name: { kind: 'name', word: 'baz' },
            },
          ],
        ],
        path: {
          path: { kind: 'string', word: './sample.jc' },
        },
      })
    })

    it('parseCallDeclaration', () => {
      const moduleId = 'parseCallDeclaration.jc'
      const content = 'call fooCall: number => string'

      const parser = createParser({ moduleId, content })
      parser.expectToken(TokenKind.SOF)

      expect(parser.parseCallDeclaration()).toMatchObject({
        name: {
          name: { kind: 'name', word: 'fooCall' },
        },
        input: {
          primitiveType: { kind: 'primitive type', word: 'number' },
        },
        output: {
          primitiveType: { kind: 'primitive type', word: 'string' },
        },
      })
    })

    it('parseDeriveDeclaration', () => {
      const moduleId = 'parseDeriveDeclaration.jc'
      const content = 'derive Date from string'

      const parser = createParser({ moduleId, content })
      parser.expectToken(TokenKind.SOF)

      expect(parser.parseDeriveDeclaration()).toMatchObject({
        name: {
          name: { kind: 'name', word: 'Date' },
        },
        type: {
          primitiveType: { kind: 'primitive type', word: 'string' },
        },
      })
    })

    it('parseTypeDeclaration', () => {
      const moduleId = 'parseTypeDeclaration.jc'
      const content = 'type foo = number'

      const parser = createParser({ moduleId, content })
      parser.expectToken(TokenKind.SOF)

      expect(parser.parseTypeDeclaration()).toMatchObject({
        name: {
          name: { kind: 'name', word: 'foo' },
        },
        type: {
          primitiveType: { kind: 'primitive type', word: 'number' },
        },
      })
    })
  })

  describe('complex', () => {
    describe('parseObjectTypeNode', () => {
      it('field with comment block', () => {
        const moduleId = 'parseObjectTypeNode.jc'
        const content = `{
          # foo1 comment
          # foo2 comment
          foo: number,

          # bar1 comment
          # bar2 comment
          bar: string 
        }`

        const parser = createParser({ moduleId, content })
        parser.expectToken(TokenKind.SOF)

        expect(parser.parseObjectTypeNode()).toMatchObject({
          fields: [
            {
              name: { name: { kind: 'name', word: 'foo' } },
              type: {
                primitiveType: { kind: 'primitive type', word: 'number' },
              },
              comment: {
                comments: [
                  { kind: 'comment', word: ' foo1 comment' },
                  { kind: 'comment', word: ' foo2 comment' },
                ],
              },
            },
            {
              name: { name: { kind: 'name', word: 'bar' } },
              type: {
                primitiveType: { kind: 'primitive type', word: 'string' },
              },
              comment: {
                comments: [
                  { kind: 'comment', word: ' bar1 comment' },
                  { kind: 'comment', word: ' bar2 comment' },
                ],
              },
            },
          ],
        })
      })
    })

    describe('parseTypeDeclaration', () => {
      it('with comment block', () => {
        const moduleId = 'parseTypeDeclaration.jc'
        const content = `
        # foo1 comment
        # foo2 comment
        type foo = number
        `

        const parser = createParser({ moduleId, content })
        parser.expectToken(TokenKind.SOF)

        expect(
          parser.parseTypeDeclaration(parser.parseCommentBlock())
        ).toMatchObject({
          name: {
            name: { kind: 'name', word: 'foo' },
          },
          type: {
            primitiveType: { kind: 'primitive type', word: 'number' },
          },
          comment: {
            comments: [
              { kind: 'comment', word: ' foo1 comment' },
              { kind: 'comment', word: ' foo2 comment' },
            ],
          },
        })
      })
    })

    describe('parseDeriveDeclaration', () => {
      it('with comment block', () => {
        const moduleId = 'parseDeriveDeclaration.jc'
        const content = `
        # foo1 comment
        # foo2 comment
        derive Date from string
        `

        const parser = createParser({ moduleId, content })
        parser.expectToken(TokenKind.SOF)

        expect(
          parser.parseDeriveDeclaration(parser.parseCommentBlock())
        ).toMatchObject({
          name: {
            name: { kind: 'name', word: 'Date' },
          },
          type: {
            primitiveType: { kind: 'primitive type', word: 'string' },
          },
          comment: {
            comments: [
              { kind: 'comment', word: ' foo1 comment' },
              { kind: 'comment', word: ' foo2 comment' },
            ],
          },
        })
      })
    })

    describe('parseCallDeclaration', () => {
      it('with comment block', () => {
        const moduleId = 'parseCallDeclaration.jc'
        const content = `
        # foo1 comment
        # foo2 comment
        call fooCall: number => string
        `

        const parser = createParser({ moduleId, content })
        parser.expectToken(TokenKind.SOF)

        expect(
          parser.parseCallDeclaration(parser.parseCommentBlock())
        ).toMatchObject({
          name: {
            name: { kind: 'name', word: 'fooCall' },
          },
          input: {
            primitiveType: { kind: 'primitive type', word: 'number' },
          },
          output: {
            primitiveType: { kind: 'primitive type', word: 'string' },
          },
          comment: {
            comments: [
              { kind: 'comment', word: ' foo1 comment' },
              { kind: 'comment', word: ' foo2 comment' },
            ],
          },
        })
      })
    })
  })
})
