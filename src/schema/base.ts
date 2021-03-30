export type Validator<I> = (input: I) => true | string

export type Converter<I, T> = (input: I) => T

export type JSONType<I, T, K extends string> = {
  kind: K
  validate: Validator<I>
  convert: Converter<I, T>
  reverseConverter: Converter<T, I>
}

export const createJSONType = <I, T, K extends string>(
  kind: K,
  validate: Validator<I>,
  convert: Converter<I, T>,
  reverseConverter: Converter<T, I>
): JSONType<I, T, K> => {
  return {
    kind,
    validate,
    convert,
    reverseConverter
  }
}