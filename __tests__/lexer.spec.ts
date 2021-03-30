import { createLexer } from '../src/language/lexer'

describe('lexer', () => {
  it('sample', () => {
    const lexer = createLexer(`
    type foo1 = number
    type foo2 = boolean
    type foo3 = null
    type foo4 = string
    
    type foo6 = [number]
    type foo7 = {
      foo: number
    }
    
    type foo8 = any
    type foo9 = none
    
    type foo10 = number | string
    type foo11 = { foo: string } & { bar: number }
    
    type foo12 = (number, string)
    
    call fooFn: number => string
    
    derive int from number
    
    derive Date from string
    
    # some comments
    
    import { bar } from './bar.jt'
      `, 'foo.jsoncall')
      expect(lexer.next()).toMatchObject({ word: 'type', kind: 'keyword' })
  })
})