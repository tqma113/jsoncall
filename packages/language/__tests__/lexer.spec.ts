import fs from 'fs'
import path from 'path'
import { createLexer } from '../src/lexer'

describe('lexer', () => {
  it('<SOF>', () => {
    const moduleId = 'foo'
    const content = ``
    const lexer = createLexer({ content, moduleId })

    expect(lexer.token).toMatchObject({
      word: void 0,
      kind: '<SOF>',
    })
  })

  it('<EOF>', () => {
    const moduleId = 'foo'
    const content = ``
    const lexer = createLexer({ content, moduleId })

    expect(lexer.token).toMatchObject({
      word: void 0,
      kind: '<SOF>',
    })

    expect(lexer.next()).toMatchObject({ word: void 0, kind: '<EOF>' })
  })

  it('comment', () => {
    const moduleId = 'foo'
    const content = `#foo`
    const lexer = createLexer({ content, moduleId })

    expect(lexer.next()).toMatchObject({
      word: 'foo',
      kind: 'comment',
    })
  })

  it('operator', () => {
    const moduleId = 'foo'
    const content = `{}[]()<>|&==>,:`
    const lexer = createLexer({ content, moduleId })

    expect(lexer.next()).toMatchObject({
      word: '{',
      kind: 'operator',
    })
    expect(lexer.next()).toMatchObject({
      word: '}',
      kind: 'operator',
    })
    expect(lexer.next()).toMatchObject({
      word: '[',
      kind: 'operator',
    })
    expect(lexer.next()).toMatchObject({
      word: ']',
      kind: 'operator',
    })
    expect(lexer.next()).toMatchObject({
      word: '(',
      kind: 'operator',
    })
    expect(lexer.next()).toMatchObject({
      word: ')',
      kind: 'operator',
    })
    expect(lexer.next()).toMatchObject({
      word: '<',
      kind: 'operator',
    })
    expect(lexer.next()).toMatchObject({
      word: '>',
      kind: 'operator',
    })
    expect(lexer.next()).toMatchObject({
      word: '|',
      kind: 'operator',
    })
    expect(lexer.next()).toMatchObject({
      word: '&',
      kind: 'operator',
    })
    expect(lexer.next()).toMatchObject({
      word: '=',
      kind: 'operator',
    })
    expect(lexer.next()).toMatchObject({
      word: '=>',
      kind: 'operator',
    })
    expect(lexer.next()).toMatchObject({
      word: ',',
      kind: 'operator',
    })
    expect(lexer.next()).toMatchObject({
      word: ':',
      kind: 'operator',
    })
  })

  it('keyword', () => {
    const moduleId = 'foo'
    const content = `type call derive from import export as`
    const lexer = createLexer({ content, moduleId })

    expect(lexer.next()).toMatchObject({
      word: 'type',
      kind: 'keyword',
    })
    expect(lexer.next()).toMatchObject({
      word: 'call',
      kind: 'keyword',
    })
    expect(lexer.next()).toMatchObject({
      word: 'derive',
      kind: 'keyword',
    })
    expect(lexer.next()).toMatchObject({
      word: 'from',
      kind: 'keyword',
    })
    expect(lexer.next()).toMatchObject({
      word: 'import',
      kind: 'keyword',
    })
    expect(lexer.next()).toMatchObject({
      word: 'export',
      kind: 'keyword',
    })
    expect(lexer.next()).toMatchObject({
      word: 'as',
      kind: 'keyword',
    })
  })

  it('primitive type', () => {
    const moduleId = 'foo'
    const content = `number string null boolean`
    const lexer = createLexer({ content, moduleId })

    expect(lexer.next()).toMatchObject({
      word: 'number',
      kind: 'primitive type',
    })
    expect(lexer.next()).toMatchObject({
      word: 'string',
      kind: 'primitive type',
    })
    expect(lexer.next()).toMatchObject({
      word: 'null',
      kind: 'primitive type',
    })
    expect(lexer.next()).toMatchObject({
      word: 'boolean',
      kind: 'primitive type',
    })
  })

  it('special type', () => {
    const moduleId = 'foo'
    const content = `any none`
    const lexer = createLexer({ content, moduleId })

    expect(lexer.next()).toMatchObject({
      word: 'any',
      kind: 'special type',
    })
    expect(lexer.next()).toMatchObject({
      word: 'none',
      kind: 'special type',
    })
  })

  describe('string', () => {
    it('sample', () => {
      const moduleId = 'foo'
      const content = `"foo"`
      const lexer = createLexer({ content, moduleId })

      expect(lexer.next()).toMatchObject({
        word: 'foo',
        kind: 'string',
      })
    })

    it('special', () => {
      const moduleId = 'foo'
      const content = `"'foo"`
      const lexer = createLexer({ content, moduleId })

      expect(lexer.next()).toMatchObject({
        word: "'foo",
        kind: 'string',
      })
    })
  })

  describe('number', () => {
    it('integer', () => {
      const moduleId = 'foo'
      const content = `123`
      const lexer = createLexer({ content, moduleId })

      expect(lexer.next()).toMatchObject({
        word: '123',
        kind: 'number',
      })
    })

    it('float', () => {
      const moduleId = 'foo'
      const content = `123.123`
      const lexer = createLexer({ content, moduleId })

      expect(lexer.next()).toMatchObject({
        word: '123.123',
        kind: 'number',
      })
    })

    it('exponential', () => {
      const moduleId = 'foo'
      const content = `123.123e10`
      const lexer = createLexer({ content, moduleId })

      expect(lexer.next()).toMatchObject({
        word: '123.123e10',
        kind: 'number',
      })
    })
  })

  it('boolean', () => {
    const moduleId = 'foo'
    const content = `true false`
    const lexer = createLexer({ content, moduleId })

    expect(lexer.next()).toMatchObject({
      word: 'true',
      kind: 'boolean',
    })
    expect(lexer.next()).toMatchObject({
      word: 'false',
      kind: 'boolean',
    })
  })

  describe('name', () => {
    it('sample', () => {
      const moduleId = 'foo'
      const content = `foo`
      const lexer = createLexer({ content, moduleId })

      expect(lexer.next()).toMatchObject({
        word: 'foo',
        kind: 'name',
      })
    })

    it('underline', () => {
      const moduleId = 'foo'
      const content = `_foo`
      const lexer = createLexer({ content, moduleId })

      expect(lexer.next()).toMatchObject({
        word: '_foo',
        kind: 'name',
      })
    })
  })

  it('sample', () => {
    const moduleId = path.resolve(__dirname, './fixtures/base.jc')
    const content = fs.readFileSync(moduleId, 'utf-8')
    const lexer = createLexer({ content, moduleId })

    expect(lexer.token).toMatchObject({
      word: void 0,
      kind: '<SOF>',
      range: { start: 0, end: 0, line: 0, column: 0 },
    })

    expect(lexer.next()).toMatchObject({
      word: 'type',
      kind: 'keyword',
      range: { start: 0, end: 4, line: 1, column: 1 },
    })
    expect(lexer.next()).toMatchObject({
      word: 'foo1',
      kind: 'name',
      range: { start: 5, end: 9, line: 1, column: 6 },
    })
    expect(lexer.next()).toMatchObject({
      word: '=',
      kind: 'operator',
      range: { start: 10, end: 11, line: 1, column: 11 },
    })
    expect(lexer.next()).toMatchObject({
      word: 'number',
      kind: 'primitive type',
      range: { start: 12, end: 18, line: 1, column: 13 },
    })

    expect(lexer.next()).toMatchObject({
      word: 'type',
      kind: 'keyword',
      range: { start: 19, end: 23, line: 2, column: 1 },
    })
    expect(lexer.next()).toMatchObject({
      word: 'foo2',
      kind: 'name',
      range: { start: 24, end: 28, line: 2, column: 6 },
    })
    expect(lexer.next()).toMatchObject({
      word: '=',
      kind: 'operator',
      range: { start: 29, end: 30, line: 2, column: 11 },
    })
    expect(lexer.next()).toMatchObject({
      word: 'boolean',
      kind: 'primitive type',
      range: { start: 31, end: 38, line: 2, column: 13 },
    })

    expect(lexer.next()).toMatchObject({ word: 'type', kind: 'keyword' })
    expect(lexer.next()).toMatchObject({ word: 'foo3', kind: 'name' })
    expect(lexer.next()).toMatchObject({ word: '=', kind: 'operator' })
    expect(lexer.next()).toMatchObject({ word: 'null', kind: 'primitive type' })

    expect(lexer.next()).toMatchObject({ word: 'type', kind: 'keyword' })
    expect(lexer.next()).toMatchObject({ word: 'foo4', kind: 'name' })
    expect(lexer.next()).toMatchObject({ word: '=', kind: 'operator' })
    expect(lexer.next()).toMatchObject({
      word: 'string',
      kind: 'primitive type',
    })

    expect(lexer.next()).toMatchObject({ word: 'type', kind: 'keyword' })
    expect(lexer.next()).toMatchObject({ word: 'foo5', kind: 'name' })
    expect(lexer.next()).toMatchObject({ word: '=', kind: 'operator' })
    expect(lexer.next()).toMatchObject({ word: '[', kind: 'operator' })
    expect(lexer.next()).toMatchObject({
      word: 'number',
      kind: 'primitive type',
    })
    expect(lexer.next()).toMatchObject({ word: ']', kind: 'operator' })

    expect(lexer.next()).toMatchObject({ word: 'type', kind: 'keyword' })
    expect(lexer.next()).toMatchObject({ word: 'foo6', kind: 'name' })
    expect(lexer.next()).toMatchObject({ word: '=', kind: 'operator' })
    expect(lexer.next()).toMatchObject({ word: '{', kind: 'operator' })
    expect(lexer.next()).toMatchObject({ word: 'foo', kind: 'name' })
    expect(lexer.next()).toMatchObject({ word: ':', kind: 'operator' })
    expect(lexer.next()).toMatchObject({
      word: 'number',
      kind: 'primitive type',
    })
    expect(lexer.next()).toMatchObject({ word: '}', kind: 'operator' })

    expect(lexer.next()).toMatchObject({ word: 'type', kind: 'keyword' })
    expect(lexer.next()).toMatchObject({ word: 'foo7', kind: 'name' })
    expect(lexer.next()).toMatchObject({ word: '=', kind: 'operator' })
    expect(lexer.next()).toMatchObject({ word: '(', kind: 'operator' })
    expect(lexer.next()).toMatchObject({
      word: 'number',
      kind: 'primitive type',
    })
    expect(lexer.next()).toMatchObject({ word: ',', kind: 'operator' })
    expect(lexer.next()).toMatchObject({
      word: 'string',
      kind: 'primitive type',
    })
    expect(lexer.next()).toMatchObject({ word: ')', kind: 'operator' })

    expect(lexer.next()).toMatchObject({ word: 'type', kind: 'keyword' })
    expect(lexer.next()).toMatchObject({ word: 'foo8', kind: 'name' })
    expect(lexer.next()).toMatchObject({ word: '=', kind: 'operator' })
    expect(lexer.next()).toMatchObject({ word: '<', kind: 'operator' })
    expect(lexer.next()).toMatchObject({
      word: 'number',
      kind: 'primitive type',
    })
    expect(lexer.next()).toMatchObject({ word: '>', kind: 'operator' })

    expect(lexer.next()).toMatchObject({ word: 'type', kind: 'keyword' })
    expect(lexer.next()).toMatchObject({ word: 'foo9', kind: 'name' })
    expect(lexer.next()).toMatchObject({ word: '=', kind: 'operator' })
    expect(lexer.next()).toMatchObject({ word: 'any', kind: 'special type' })

    expect(lexer.next()).toMatchObject({ word: 'type', kind: 'keyword' })
    expect(lexer.next()).toMatchObject({ word: 'foo10', kind: 'name' })
    expect(lexer.next()).toMatchObject({ word: '=', kind: 'operator' })
    expect(lexer.next()).toMatchObject({ word: 'none', kind: 'special type' })

    expect(lexer.next()).toMatchObject({ word: 'type', kind: 'keyword' })
    expect(lexer.next()).toMatchObject({ word: 'foo11', kind: 'name' })
    expect(lexer.next()).toMatchObject({ word: '=', kind: 'operator' })
    expect(lexer.next()).toMatchObject({
      word: 'number',
      kind: 'primitive type',
    })
    expect(lexer.next()).toMatchObject({ word: '|', kind: 'operator' })
    expect(lexer.next()).toMatchObject({
      word: 'string',
      kind: 'primitive type',
    })

    expect(lexer.next()).toMatchObject({ word: 'type', kind: 'keyword' })
    expect(lexer.next()).toMatchObject({ word: 'foo12', kind: 'name' })
    expect(lexer.next()).toMatchObject({ word: '=', kind: 'operator' })
    expect(lexer.next()).toMatchObject({ word: '{', kind: 'operator' })
    expect(lexer.next()).toMatchObject({ word: 'foo', kind: 'name' })
    expect(lexer.next()).toMatchObject({ word: ':', kind: 'operator' })
    expect(lexer.next()).toMatchObject({
      word: 'string',
      kind: 'primitive type',
    })
    expect(lexer.next()).toMatchObject({ word: '}', kind: 'operator' })
    expect(lexer.next()).toMatchObject({ word: '&', kind: 'operator' })
    expect(lexer.next()).toMatchObject({ word: '{', kind: 'operator' })
    expect(lexer.next()).toMatchObject({ word: 'bar', kind: 'name' })
    expect(lexer.next()).toMatchObject({ word: ':', kind: 'operator' })
    expect(lexer.next()).toMatchObject({
      word: 'number',
      kind: 'primitive type',
    })
    expect(lexer.next()).toMatchObject({ word: '}', kind: 'operator' })

    expect(lexer.next()).toMatchObject({ word: 'type', kind: 'keyword' })
    expect(lexer.next()).toMatchObject({ word: 'foo13', kind: 'name' })
    expect(lexer.next()).toMatchObject({ word: '=', kind: 'operator' })
    expect(lexer.next()).toMatchObject({ word: 'foo13', kind: 'string' })

    expect(lexer.next()).toMatchObject({ word: 'type', kind: 'keyword' })
    expect(lexer.next()).toMatchObject({ word: 'foo14', kind: 'name' })
    expect(lexer.next()).toMatchObject({ word: '=', kind: 'operator' })
    expect(lexer.next()).toMatchObject({ word: '0', kind: 'number' })

    expect(lexer.next()).toMatchObject({ word: 'type', kind: 'keyword' })
    expect(lexer.next()).toMatchObject({ word: 'foo15', kind: 'name' })
    expect(lexer.next()).toMatchObject({ word: '=', kind: 'operator' })
    expect(lexer.next()).toMatchObject({ word: 'true', kind: 'boolean' })

    expect(lexer.next()).toMatchObject({ word: 'type', kind: 'keyword' })
    expect(lexer.next()).toMatchObject({ word: 'foo16', kind: 'name' })
    expect(lexer.next()).toMatchObject({ word: '=', kind: 'operator' })
    expect(lexer.next()).toMatchObject({ word: 'false', kind: 'boolean' })

    expect(lexer.next()).toMatchObject({
      word: ' some comments',
      kind: 'comment',
    })

    expect(lexer.next()).toMatchObject({ word: 'call', kind: 'keyword' })
    expect(lexer.next()).toMatchObject({ word: 'fooCall', kind: 'name' })
    expect(lexer.next()).toMatchObject({ word: ':', kind: 'operator' })
    expect(lexer.next()).toMatchObject({
      word: 'number',
      kind: 'primitive type',
    })
    expect(lexer.next()).toMatchObject({ word: '=>', kind: 'operator' })
    expect(lexer.next()).toMatchObject({
      word: 'string',
      kind: 'primitive type',
    })

    expect(lexer.next()).toMatchObject({ word: 'import', kind: 'keyword' })
    expect(lexer.next()).toMatchObject({ word: '{', kind: 'operator' })
    expect(lexer.next()).toMatchObject({ word: 'bar', kind: 'name' })
    expect(lexer.next()).toMatchObject({ word: '}', kind: 'operator' })
    expect(lexer.next()).toMatchObject({ word: 'from', kind: 'keyword' })
    expect(lexer.next()).toMatchObject({ word: './bar.jc', kind: 'string' })

    expect(lexer.next()).toMatchObject({ word: 'derive', kind: 'keyword' })
    expect(lexer.next()).toMatchObject({ word: 'int', kind: 'name' })
    expect(lexer.next()).toMatchObject({ word: 'from', kind: 'keyword' })
    expect(lexer.next()).toMatchObject({
      word: 'number',
      kind: 'primitive type',
    })

    expect(lexer.next()).toMatchObject({ word: 'derive', kind: 'keyword' })
    expect(lexer.next()).toMatchObject({ word: 'Date', kind: 'name' })
    expect(lexer.next()).toMatchObject({ word: 'from', kind: 'keyword' })
    expect(lexer.next()).toMatchObject({
      word: 'string',
      kind: 'primitive type',
    })

    expect(lexer.next()).toMatchObject({ word: 'export', kind: 'keyword' })
    expect(lexer.next()).toMatchObject({ word: '{', kind: 'operator' })
    expect(lexer.next()).toMatchObject({ word: 'foo1', kind: 'name' })
    expect(lexer.next()).toMatchObject({ word: ',', kind: 'operator' })
    expect(lexer.next()).toMatchObject({ word: 'foo2', kind: 'name' })
    expect(lexer.next()).toMatchObject({ word: ',', kind: 'operator' })
    expect(lexer.next()).toMatchObject({ word: 'foo3', kind: 'name' })
    expect(lexer.next()).toMatchObject({ word: ',', kind: 'operator' })
    expect(lexer.next()).toMatchObject({ word: 'foo4', kind: 'name' })
    expect(lexer.next()).toMatchObject({ word: ',', kind: 'operator' })
    expect(lexer.next()).toMatchObject({ word: 'foo5', kind: 'name' })
    expect(lexer.next()).toMatchObject({ word: ',', kind: 'operator' })
    expect(lexer.next()).toMatchObject({ word: 'foo6', kind: 'name' })
    expect(lexer.next()).toMatchObject({ word: ',', kind: 'operator' })
    expect(lexer.next()).toMatchObject({ word: 'foo7', kind: 'name' })
    expect(lexer.next()).toMatchObject({ word: ',', kind: 'operator' })
    expect(lexer.next()).toMatchObject({ word: 'foo8', kind: 'name' })
    expect(lexer.next()).toMatchObject({ word: ',', kind: 'operator' })
    expect(lexer.next()).toMatchObject({ word: 'foo9', kind: 'name' })
    expect(lexer.next()).toMatchObject({ word: ',', kind: 'operator' })
    expect(lexer.next()).toMatchObject({ word: 'foo10', kind: 'name' })
    expect(lexer.next()).toMatchObject({ word: ',', kind: 'operator' })
    expect(lexer.next()).toMatchObject({ word: 'foo11', kind: 'name' })
    expect(lexer.next()).toMatchObject({ word: ',', kind: 'operator' })
    expect(lexer.next()).toMatchObject({ word: 'foo12', kind: 'name' })
    expect(lexer.next()).toMatchObject({ word: ',', kind: 'operator' })
    expect(lexer.next()).toMatchObject({ word: 'foo13', kind: 'name' })
    expect(lexer.next()).toMatchObject({ word: ',', kind: 'operator' })
    expect(lexer.next()).toMatchObject({ word: 'foo14', kind: 'name' })
    expect(lexer.next()).toMatchObject({ word: ',', kind: 'operator' })
    expect(lexer.next()).toMatchObject({ word: 'foo15', kind: 'name' })
    expect(lexer.next()).toMatchObject({ word: ',', kind: 'operator' })
    expect(lexer.next()).toMatchObject({ word: 'bar', kind: 'name' })
    expect(lexer.next()).toMatchObject({ word: ',', kind: 'operator' })
    expect(lexer.next()).toMatchObject({ word: 'int', kind: 'name' })
    expect(lexer.next()).toMatchObject({ word: ',', kind: 'operator' })
    expect(lexer.next()).toMatchObject({ word: 'Date', kind: 'name' })
    expect(lexer.next()).toMatchObject({ word: '}', kind: 'operator' })

    expect(lexer.next()).toMatchObject({ word: void 0, kind: '<EOF>' })
  })
})
