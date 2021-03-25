// prettier-ignore
export enum Symbol {
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

  Well                  =         '#'
}

function getKeys<T extends {}>(o: T): Array<keyof T> {
  return Object.keys(o) as Array<keyof T>
}

export const getSymbol = (char: string): Symbol | null => {
  for (let key of getKeys(Symbol)) {
    if (Symbol[key] === char) {
      return Symbol[key]
    }
  }
  return null
}

export const isSymbol = (char: string): boolean => {
  for (let key of getKeys(Symbol)) {
    if (Symbol[key] === char) {
      return true
    }
  }
  return false
}

const DIGITS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
export const isDigit = (char: string): boolean => {
  return DIGITS.includes(char)
}

const 