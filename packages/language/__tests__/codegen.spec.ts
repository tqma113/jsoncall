import fs from 'fs'
import path from 'path'
import {
  PrimitiveTypeEnum,
  SpecialTypeEnum,
  createLinkDefination,
  createDeriveDefination,
  createPrimitiveType,
  createCallDefination,
  createExportDefination,
  createTypeDefination,
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
  bundle,
  codegen,
  codegenLinkDefination,
  codegenDeriveDefination,
  codegenCallDefination,
  codegenExportDefination,
  codegenTypeDefination,
  codegenType,
} from '../src'
import { nodeModuleResolver } from './node'

describe('codegen', () => {
  it('Schema', () => {
    const moduleId = path.resolve(__dirname, './fixtures/baz.jc')
    const schema = bundle(moduleId, nodeModuleResolver)
    const map = codegen(schema)

    expect(map.size).toBe(3)
  })

  it('SchemaModule', () => {
    const moduleId = path.resolve(__dirname, './fixtures/foo.jc')
    const content = fs.readFileSync(moduleId, 'utf-8')
    const schema = bundle(moduleId, nodeModuleResolver)
    const map = codegen(schema)

    expect(map.size).toBe(1)
    expect(map.get(moduleId)).toBe(content)
  })

  describe('LinkDefination', () => {
    it('sample', () => {
      expect(
        codegenLinkDefination(createLinkDefination('foo', [['foo1', 'foo1']]))
      ).toBe('import { foo1 } from "foo"')
    })

    it('rename', () => {
      expect(
        codegenLinkDefination(createLinkDefination('foo', [['foo1', 'foo2']]))
      ).toBe('import { foo1 as foo2 } from "foo"')
    })

    it('mutiple', () => {
      expect(
        codegenLinkDefination(
          createLinkDefination('foo', [
            ['foo1', 'foo1'],
            ['foo2', 'foo3'],
          ])
        )
      ).toBe('import { foo1, foo2 as foo3 } from "foo"')
    })
  })

  describe('DeriveDefination', () => {
    it('sample', () => {
      expect(
        codegenDeriveDefination(
          createDeriveDefination(
            'BigInt',
            createPrimitiveType(PrimitiveTypeEnum.String),
            null
          )
        )
      ).toBe('derive BigInt from string')
    })

    it('with comment', () => {
      expect(
        codegenDeriveDefination(
          createDeriveDefination(
            'BigInt',
            createPrimitiveType(PrimitiveTypeEnum.String),
            'foo'
          )
        )
      ).toBe('#foo\nderive BigInt from string')
    })
  })

  describe('CallDefination', () => {
    it('sample', () => {
      expect(
        codegenCallDefination(
          createCallDefination(
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
        codegenCallDefination(
          createCallDefination(
            'fooCall',
            createPrimitiveType(PrimitiveTypeEnum.String),
            createPrimitiveType(PrimitiveTypeEnum.String),
            'foo'
          )
        )
      ).toBe('#foo\ncall fooCall: string => string')
    })
  })

  it('ExportDefination', () => {
    expect(
      codegenExportDefination(createExportDefination(['foo1', 'foo2']))
    ).toBe('export {\n  foo1,\n  foo2,\n}')
  })

  describe('TypeDefination', () => {
    it('sample', () => {
      expect(
        codegenTypeDefination(
          createTypeDefination(
            'foo',
            createPrimitiveType(PrimitiveTypeEnum.String),
            null
          )
        )
      ).toBe('type foo = string')
    })

    it('with comment', () => {
      expect(
        codegenTypeDefination(
          createTypeDefination(
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
