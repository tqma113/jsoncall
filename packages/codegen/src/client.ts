import { check, Schema } from 'jc-schema'
import { name as getName, validate, convert, ConvertError } from 'jc-builder'
import { IntrospectionCalling, IntrospectionCallingOutputType } from 'jc-server'
import { SerializationError } from 'jc-serialization'
import { format, Options } from 'prettier'
import {
  builderCodegenSchema,
  genGenerics,
  genProps,
  genPropsNames,
} from './builder'
import type { Sender, SyncSender } from 'jc-client'

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
  import { createJSONCall, createSyncJSONCall, Sender, SyncSender, createSender, createBatchSender, createSyncSender } from 'jc-client'

  ${code}

  export const createClient = ${genGenerics(generics)}(
    ${propsStr}
    send: Sender
  ) => {
    const builderSchema = createBuilderSchema(${genPropsNames(props)})
    const callSender = createSender(send, JSON.stringify, JSON.parse)

    return {
      ${calls
        .map(
          (key) => `${key}: createJSONCall(
        builderSchema.calls.${key},
        JSON.stringify,
        JSON.parse,
        callSender
      ),`
        )
        .join('')}
    }
  }

  export const createBatchClient = ${genGenerics(generics)}(
    ${propsStr}
    send: Sender
  ) => {
    const builderSchema = createBuilderSchema(${genPropsNames(props)})
    const callSender = createBatchSender(send, JSON.stringify, JSON.parse)

    return {
      ${calls
        .map(
          (key) => `${key}: createJSONCall(
        builderSchema.calls.${key},
        JSON.stringify,
        JSON.parse,
        callSender
      ),`
        )
        .join('')}
    }
  }

  export const createSyncClient = ${genGenerics(generics)}(
    ${propsStr}
    send: SyncSender
  ) => {
    const builderSchema = createBuilderSchema(${genPropsNames(props)})
    const callSender = createSyncSender(send, JSON.stringify, JSON.parse)

    return {
      ${calls
        .map(
          (key) => `${key}: createSyncJSONCall(
        builderSchema.calls.${key},
        JSON.stringify,
        JSON.parse,
        callSender
      ),`
        )
        .join('')}
    }
  }
  `,
    { parser: 'typescript', ...options }
  )
}

export const introspectionClientCodegen = async (
  send: Sender | SyncSender,
  options?: Options
): Promise<string> => {
  const output = await send(JSON.stringify(IntrospectionCalling()))

  try {
    const outputObject = JSON.parse(output)
    const validateResult = validate(
      IntrospectionCallingOutputType,
      outputObject
    )
    if (validateResult === true) {
      try {
        const output = convert(IntrospectionCallingOutputType, outputObject)
        const schema = output.output as Schema
        const result = check(schema)
        if (result === null) {
          return clientCodegen(schema, options)
        } else {
          throw result
        }
      } catch (err) {
        throw new ConvertError(err, getName(IntrospectionCallingOutputType))
      }
    } else {
      throw validateResult
    }
  } catch (err) {
    throw new SerializationError(err, output)
  }
}
