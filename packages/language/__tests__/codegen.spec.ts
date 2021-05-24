import fs from 'fs'
import path from 'path'
import {
  PrimitiveTypeEnum,
  SpecialTypeEnum,
  createDeriveDefinition,
  createPrimitiveType,
  createCallDefinition,
  createTypeDefinition,
  createSpecialType,
  createLiteralType,
  createListType,
  createObjectType,
  createObjectTypeFiled,
  createTupleType,
  createRecordType,
  createUnionType,
  createIntersectType,
  createNameType,
} from 'jc-schema'
import {
  load,
  codegen,
  codegenDeriveDefinition,
  codegenCallDefinition,
  codegenTypeDefinition,
  codegenType,
} from '../src'
import { read } from './node'

describe('codegen', () => {
  it('Schema', () => {
    const moduleId = path.resolve(__dirname, './fixtures/foo.jc')
    const content = fs.readFileSync(moduleId, 'utf-8')
    const schema = load(moduleId, read)
    const source = codegen(schema)

    expect(source).toBe(content)
  })

  describe('DeriveDefinition', () => {
    it('sample', () => {
      expect(
        codegenDeriveDefinition(
          createDeriveDefinition(
            'BigInt',
            createPrimitiveType(PrimitiveTypeEnum.String),
            null
          )
        )
      ).toBe('derive BigInt from string')
    })

    it('with comment', () => {
      expect(
        codegenDeriveDefinition(
          createDeriveDefinition(
            'BigInt',
            createPrimitiveType(PrimitiveTypeEnum.String),
            'foo'
          )
        )
      ).toBe('#foo\nderive BigInt from string')
    })
  })

  describe('CallDefinition', () => {
    it('sample', () => {
      expect(
        codegenCallDefinition(
          createCallDefinition(
            'fooCall',
            createPrimitiveType(PrimitiveTypeEnum.String),
            createPrimitiveType(PrimitiveTypeEnum.String),
            null
          )
        )
      ).toBe('call fooCall: string => string')
    })

    it('with comment', () => {
      expect(
        codegenCallDefinition(
          createCallDefinition(
            'fooCall',
            createPrimitiveType(PrimitiveTypeEnum.String),
            createPrimitiveType(PrimitiveTypeEnum.String),
            'foo'
          )
        )
      ).toBe('#foo\ncall fooCall: string => string')
    })
  })

  describe('TypeDefinition', () => {
    it('sample', () => {
      expect(
        codegenTypeDefinition(
          createTypeDefinition(
            'foo',
            createPrimitiveType(PrimitiveTypeEnum.String),
            null
          )
        )
      ).toBe('type foo = string')
    })

    it('with comment', () => {
      expect(
        codegenTypeDefinition(
          createTypeDefinition(
            'foo',
            createPrimitiveType(PrimitiveTypeEnum.String),
            'foo'
          )
        )
      ).toBe('#foo\ntype foo = string')
    })
  })

  describe('Type', () => {
    it('PrimitiveType', () => {
      expect(codegenType(createPrimitiveType(PrimitiveTypeEnum.Boolean))).toBe(
        'boolean'
      )
      expect(codegenType(createPrimitiveType(PrimitiveTypeEnum.String))).toBe(
        'string'
      )
      expect(codegenType(createPrimitiveType(PrimitiveTypeEnum.Null))).toBe(
        'null'
      )
      expect(codegenType(createPrimitiveType(PrimitiveTypeEnum.Number))).toBe(
        'number'
      )
    })

    it('SpecialType', () => {
      expect(codegenType(createSpecialType(SpecialTypeEnum.Any))).toBe('any')
      expect(codegenType(createSpecialType(SpecialTypeEnum.None))).toBe('none')
    })

    describe('LiteralType', () => {
      it('number', () => {
        expect(codegenType(createLiteralType(123))).toBe('123')
      })

      it('boolean', () => {
        expect(codegenType(createLiteralType(true))).toBe('true')
      })

      it('string', () => {
        expect(codegenType(createLiteralType('foo'))).toBe('"foo"')
      })
    })

    it('ListType', () => {
      expect(
        codegenType(
          createListType(createPrimitiveType(PrimitiveTypeEnum.String))
        )
      ).toBe('[string]')
    })

    describe('ObjectType', () => {
      it('sample', () => {
        expect(
          codegenType(
            createObjectType([
              createObjectTypeFiled(
                'foo',
                createPrimitiveType(PrimitiveTypeEnum.String),
                null
              ),
              createObjectTypeFiled(
                'bar',
                createPrimitiveType(PrimitiveTypeEnum.Number),
                null
              ),
            ])
          )
        ).toBe('{\n  foo: string,\n  bar: number\n}')
      })

      it('with comment', () => {
        expect(
          codegenType(
            createObjectType([
              createObjectTypeFiled(
                'foo',
                createPrimitiveType(PrimitiveTypeEnum.String),
                'foo'
              ),
              createObjectTypeFiled(
                'bar',
                createPrimitiveType(PrimitiveTypeEnum.Number),
                'bar'
              ),
            ])
          )
        ).toBe('{\n  #foo\n  foo: string,\n  #bar\n  bar: number\n}')
      })

      it('nest', () => {
        expect(
          codegenType(
            createObjectType([
              createObjectTypeFiled(
                'foo',
                createPrimitiveType(PrimitiveTypeEnum.String),
                'foo'
              ),
              createObjectTypeFiled(
                'bar',
                createPrimitiveType(PrimitiveTypeEnum.Number),
                'bar'
              ),
              createObjectTypeFiled(
                'baz',
                createObjectType([
                  createObjectTypeFiled(
                    'foo',
                    createPrimitiveType(PrimitiveTypeEnum.String),
                    'foo'
                  ),
                  createObjectTypeFiled(
                    'bar',
                    createPrimitiveType(PrimitiveTypeEnum.Number),
                    'bar'
                  ),
                ]),
                'baz'
              ),
            ])
          )
        ).toBe(
          '{\n  #foo\n  foo: string,\n  #bar\n  bar: number,\n  #baz\n  baz: {\n    #foo\n    foo: string,\n    #bar\n    bar: number\n  }\n}'
        )
      })
    })

    describe('TupleType', () => {
      it('sample', () => {
        expect(
          codegenType(
            createTupleType([createPrimitiveType(PrimitiveTypeEnum.String)])
          )
        ).toBe('(string)')
      })

      it('mutiple', () => {
        expect(
          codegenType(
            createTupleType([
              createPrimitiveType(PrimitiveTypeEnum.String),
              createPrimitiveType(PrimitiveTypeEnum.Number),
            ])
          )
        ).toBe('(string, number)')
      })
    })

    it('RecordType', () => {
      expect(
        codegenType(
          createRecordType(createPrimitiveType(PrimitiveTypeEnum.String))
        )
      ).toBe('<string>')
    })

    describe('UnionType', () => {
      it('sample', () => {
        expect(
          codegenType(
            createUnionType([
              createPrimitiveType(PrimitiveTypeEnum.String),
              createPrimitiveType(PrimitiveTypeEnum.Number),
            ])
          )
        ).toBe('string | number')
      })

      it('single', () => {
        expect(
          codegenType(
            createUnionType([createPrimitiveType(PrimitiveTypeEnum.String)])
          )
        ).toBe('string')
      })

      it('mutiple', () => {
        expect(
          codegenType(
            createUnionType([
              createPrimitiveType(PrimitiveTypeEnum.String),
              createPrimitiveType(PrimitiveTypeEnum.Number),
              createPrimitiveType(PrimitiveTypeEnum.Boolean),
            ])
          )
        ).toBe('string | number | boolean')
      })
    })

    describe('IntersectType', () => {
      it('sample', () => {
        expect(
          codegenType(
            createIntersectType([
              createPrimitiveType(PrimitiveTypeEnum.String),
              createPrimitiveType(PrimitiveTypeEnum.Number),
            ])
          )
        ).toBe('string & number')
      })

      it('single', () => {
        expect(
          codegenType(
            createIntersectType([createPrimitiveType(PrimitiveTypeEnum.String)])
          )
        ).toBe('string')
      })

      it('mutiple', () => {
        expect(
          codegenType(
            createIntersectType([
              createPrimitiveType(PrimitiveTypeEnum.String),
              createPrimitiveType(PrimitiveTypeEnum.Number),
              createPrimitiveType(PrimitiveTypeEnum.Boolean),
            ])
          )
        ).toBe('string & number & boolean')
      })
    })

    it('NameType', () => {
      expect(codegenType(createNameType('foo'))).toBe('foo')
    })
  })
})
