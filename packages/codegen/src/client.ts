import { format, Options } from 'prettier'
import {
  builderCodegenSchema,
  genGenerics,
  genProps,
  genPropsNames,
} from './builder'
import type { Schema } from 'jc-schema'

export const clientCodegen = (schema: Schema, options?: Options): string => {
  const { importItems, code, generics, props, calls } = builderCodegenSchema(
    schema
  )

  let propsStr = genProps(props)
  if (propsStr) {
    propsStr += ','
  }

  return format(
    `import {
    ${importItems.map((item) => `${item},`).join('\n')}
  } from 'jc-builder'
  import { createJSONCall, Sender, createSender } from 'jc-client'

  ${code}

  export const createClient = ${genGenerics(generics)}(
    ${propsStr}
    send: Sender
  ) => {
    const builderSchema = createBuilderSchema(${genPropsNames(props)})

    return {
      ${calls
        .map(
          (key) => `${key}: createJSONCall(
        builderSchema.calls.${key},
        JSON.stringify,
        JSON.parse,
        createSender(send, JSON.stringify, JSON.parse)
      ),`
        )
        .join('')}
    }
  }
  `,
    { parser: 'typescript', ...options }
  )
}
