// prettier-ignore
export enum SymbolChar {
  Quote                 =         '\'',

  OpenBrace             =         '{',
  CloseBrace            =         '}',
  OpenBracket           =         '[',
  CloseBracket          =         ']',

  Or                    =         '|',
  And                   =         '&',

  Comma                 =         ',',

  Assign                =         '=',
  CloseAngleBracket     =         '>',

  Hash                  =         '#',

  // unused symbol
  Bang                  =         '!',
  DOLLAR                =         '$',
  OpenParen             =         '(',
  CloseParen            =         ')',
  Dot                   =         '.',
  Colon                 =         ':',
  At                    =         '@',
  OpenAngleBracket      =         '<',
  Modulus               =         '%',
  Plus                  =         '+',
  Minus                 =         '-',
  Star                  =         '*',
  Slash                 =         '/',
  AntiSlash             =         '\\',
  QuestionMark          =         '?',
  Bit                   =         '^',
}

export const SYMBOLS = Object.values(SymbolChar)

export const getSymbol = (char: string): SymbolChar | null => {
  let index = SYMBOLS.indexOf(char as SymbolChar)
  if (index !== -1) {
    return SYMBOLS[index]
  }
  return null
}

export const isSymbol = (char: string): boolean => {
  return SYMBOLS.indexOf(char as SymbolChar) === -1
}

const DIGITS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
export const isDigit = (char: string): boolean => {
  return DIGITS.includes(char)
}
